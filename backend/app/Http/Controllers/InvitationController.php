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
    // Lấy toàn bộ thiệp mời 
    public function index(Request $request)
    {
        // Lấy Id user người dùng hiện tại 
        $userId = $request->user()->id;

        $invitation = Invitation::where('user_id', $userId)->withCount('logs')->latest()->get();

        if (!$invitation) {
            return response()->json([
                'success' => false,
                'message' => "Không có thiệp nào!",
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $invitation,
        ]);
    }

    // Hàm tạo mới thiệp mời 
    public function storeOrUpdate(InvitationRequest $request)
    {
        try {
            // Lấy user id từ request
            $user = $request->user();
            $userId = $user->id;
            $invitationId = $request->input('id');

            // Tìm thiệp cũ để lấy thông tin ảnh cũ
            $invitation = Invitation::where('id', $invitationId)->where('user_id', $userId)->first();

            $data = $request->validated();
            $data['user_id'] = $userId;

            // Xử lý tạo slug duy nhất 
            if (!$invitation) {
                $baseSlug = Str::slug($request->guest_name ?: 'dam-cuoi');
                $slug = $baseSlug;
                $count = 1;
                while (Invitation::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . "_" . $count;
                    $count++;
                }
                $data['slug'] = $slug;
            }

            // Xử lý Cover Image 
            if ($request->hasFile('cover_image')) {
                if ($invitation && $invitation->cover_image) {
                    Storage::disk('public')->delete('invitations/covers/' . $invitation->cover_image);
                }
                $file = $request->file('cover_image');
                $fileName = time() . '_cv_' . $file->getClientOriginalName();
                $file->storeAs('invitations/covers', $fileName, 'public');
                $data['cover_image'] = $fileName;
            }

            // Xử lý ảnh QR code
            if ($request->hasFile('qr_code_bank')) {
                if ($invitation && $invitation->qr_code_bank) {
                    Storage::disk('public')->delete('invitations/qrcode/' . $invitation->qr_code_bank);
                }
                $file = $request->file('qr_code_bank');
                $fileName = time() . '_qr_' . $file->getClientOriginalName();
                $file->storeAs('invitations/qrcode', $fileName, 'public');
                $data['qr_code_bank'] = $fileName;
            }

            // Xử lý Album (Array)
            if ($request->hasFile('album_image')) {
                if ($invitation && $invitation->album_image) {
                    foreach ($invitation->album_image as $oldImage) {
                        Storage::disk('public')->delete('invitation/albums/' . $oldImage);
                    }
                }
                $albumPath = [];
                foreach ($request->file('album_image') as $image) {
                    $fileName = time() . '_alb_' . $image->getClientOriginalName();
                    $image->storeAs('invitations/albums', $fileName, 'public');
                    $albumPath[] = $fileName;
                }
                $data['album_image'] = $albumPath;
            }

            // Lưu vào database
            $result = Invitation::updateOrCreate(
                ['id' => $invitationId, 'user_id' => $userId],
                $data
            );

            return response()->json([
                'success' => true,
                'message' =>  $invitation ? 'Cập nhập thiệp mời thành công!' : 'Tạo thiệp mời thành công!',
                'data' => $result,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $th->getMessage()
            ], 500);
        }
    }

    // Xem chi tiết thiệp mời dành cho khách mời
    public function show(Request $request, $slug)
    {
        // 1. Tìm thiệp theo slug trước
        $invitation = Invitation::where('slug', $slug)->firstOrFail();

        // 2. Ghi nhật ký truy cập (Tăng lượt xem trước khi lấy dữ liệu)
        ActivityLog::create([
            'invitation_id' => $invitation->id,
            'ip_address'    => $request->ip(),
            'user_agent'    => $request->header('User-Agent'),
            'viewed_at'     => now(),
        ]);

        // 3. Load thêm các quan hệ và đếm (Sử dụng load() và loadCount() riêng biệt)
        $invitation->load(['guestbooks' => function ($query) {
            $query->latest();
        }]);

        $invitation->loadCount('logs'); // Laravel sẽ tự thêm thuộc tính logs_count vào $invitation

        // 4. Trả về
        return response()->json([
            'success' => true,
            'data'    => $invitation,
        ]);
    }
}
