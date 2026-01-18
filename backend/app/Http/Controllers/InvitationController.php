<?php

namespace App\Http\Controllers;

use App\Http\Requests\InvitationRequest;
use App\Models\ActivityLog;
use App\Models\Invitation;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use function Illuminate\Support\now;

class InvitationController extends Controller
{
    // Lấy tất cả các thiệp thuộc sự kiện nào đó
    public function index(Request $request, $weddingEventSlug)
    {
        // Lấy Id user người dùng hiện tại 
        $userId = $request->user()->id;

        $invitation = Invitation::where('user_id', $userId)->where('wedding_event_slug', $weddingEventSlug)->latest()->get();

        if ($invitation->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => "Không có thiệp nào!",
                'data' => [],
            ]);
        }
        $invitation->load('weddingEvent', 'guestbooks'); // Lấy thông tin sự kiện và các bình luận thuộc sự kiện
        return response()->json([
            'success' => true,
            'data' => $invitation,
        ]);
    }

    // Tạo hoặc cập nhập thiêp 
    public function storeOrUpdate(Request $request, $weddingEventSlug)
    {
        try {
            $user = $request->user();
            $invitationId = $request->input('id');

            // 1. Validate dữ liệu đầu vào
            $validatedData = $request->validate([
                'id' => 'nullable|integer',
                'guest_name' => 'required|string|max:50',
                'is_attended' => 'integer|in:0,1',
            ]);

            // 2. Tìm thiệp cũ (nếu có id) để kiểm tra quyền sở hữu
            $invitation = null;
            if ($invitationId) {
                $invitation = Invitation::where('id', $invitationId)
                    ->where('user_id', $user->id)
                    ->first();
            }

            // 3. Xử lý logic Slug (Đảm bảo luôn có giá trị để lưu)
            // Nếu tạo mới HOẶC đổi tên khách mời thì mới tạo slug mới
            if (!$invitation || $invitation->guest_name !== $validatedData['guest_name']) {
                $slug = Str::slug($validatedData['guest_name']) . '-' . Str::lower(Str::random(6));
            } else {
                $slug = $invitation->slug;
            }

            // 5. Sử dụng updateOrCreate để lưu dữ liệu
            // Mảng 1: Điều kiện tìm kiếm
            // Mảng 2: Dữ liệu cần cập nhật/tạo mới
            $result = Invitation::updateOrCreate(
                [
                    'id' => $invitationId,
                    'user_id' => $user->id
                ],
                [
                    'wedding_event_slug' => $weddingEventSlug,
                    'guest_name' => $validatedData['guest_name'],
                    'slug' => $slug,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => $invitationId ? "Cập nhật thiệp thành công!" : "Tạo thiệp thành công!",
                'data' => $result,
            ], $invitationId ? 200 : 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $th->getMessage()
            ], 500);
        }
    }

    // Xem chi tiết thiệp mời dành cho khách mời
    public function show(Request $request, $weddingEventSlug, $guestNameSlug)
    {
        // Tìm thiệp theo slug trước
        $invitation = Invitation::where('slug', $guestNameSlug)
            ->where('wedding_event_slug', $weddingEventSlug)->firstOrFail();

        // Ghi nhật ký truy cập (Tăng lượt xem trước khi lấy dữ liệu)
        ActivityLog::create([
            'invitation_id' => $invitation->id,
            'ip_address'    => $request->ip(),
            'user_agent'    => $request->header('User-Agent'),
            'viewed_at'     => now(),
        ]);

        // Load thêm các quan hệ và đếm (Sử dụng load() và loadCount() riêng biệt)
        $invitation->load(['weddingEvent', 'guestbooks' => function ($query) {
            $query->latest();
        }]);

        $invitation->loadCount('logs'); // Laravel sẽ tự thêm thuộc tính logs_count vào $invitation

        //Trả về
        return response()->json([
            'success' => true,
            'data'    => $invitation,
        ]);
    }

    // Phản hồi 
    public function respond(Request $request, $weddingEventSlug, $guestNameSlug)
    {
        $validatedData = $request->validate([
            'is_attended' => 'required|in:0,1',
        ]);

        // Tìm thiệp dựa trên slug để đảm bảo tính an toàn
        $invitation = Invitation::where('wedding_event_slug', $weddingEventSlug)
            ->where('slug', $guestNameSlug)
            ->firstOrFail();

        $invitation->update([
            'is_attended' => $validatedData['is_attended']
        ]);

        return response()->json(['message' => 'Cập nhật thành công!']);
    }
}
