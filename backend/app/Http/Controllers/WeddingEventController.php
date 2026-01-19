<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Models\WeddingEvent;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WeddingEventController extends Controller
{
    // Lấy toàn bộ sự kiện 
    public function index(Request $request)
    {
        // Lấy Id user người dùng hiện tại 
        $userId = $request->user()->id;

        $invitation = WeddingEvent::where('user_id', $userId)->latest()->get();

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

    // Hàm tạo mới hoặc cập nhật sự kiện
    public function storeOrUpdate(EventRequest $request)
    {
        try {
            // Lấy user id từ request
            $user = $request->user();
            $userId = $user->id;
            $wId = $request->input('id');

            // Tìm sự cũ để lấy thông tin ảnh cũ
            $weddingEvent = WeddingEvent::where('id', $wId)->where('user_id', $userId)->first();

            $data = $request->validated();
            $data['user_id'] = $userId;

            // Xử lý tạo slug duy nhất 
            if (!$weddingEvent) {
                $baseSlug = Str::slug($request->groom_name . '-' . $request->bride_name ?: 'dam-cuoi');
                $slug = $baseSlug;
                $count = 1;
                while (WeddingEvent::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . "_" . $count;
                    $count++;
                }
                $data['slug'] = $slug;
            }

            // Xử lý Cover Image 
            if ($request->hasFile('cover_image')) {
                if ($weddingEvent && $weddingEvent->cover_image) {
                    Storage::disk('public')->delete('weddingevents/covers/' . $weddingEvent->cover_image);
                }
                $file = $request->file('cover_image');
                $fileName = time() . '_cv_' . $file->getClientOriginalName();
                $file->storeAs('weddingevents/covers', $fileName, 'public');
                $data['cover_image'] = $fileName;
            }

            // Xử lý ảnh QR code
            if ($request->hasFile('qr_code_bank')) {
                if ($weddingEvent && $weddingEvent->qr_code_bank) {
                    Storage::disk('public')->delete('weddingevents/qrcode/' . $weddingEvent->qr_code_bank);
                }
                $file = $request->file('qr_code_bank');
                $fileName = time() . '_qr_' . $file->getClientOriginalName();
                $file->storeAs('weddingevents/qrcode', $fileName, 'public');
                $data['qr_code_bank'] = $fileName;
            }

            // Xử lý Album (Array)
            if ($request->hasFile('album_image')) {
                if ($weddingEvent && $weddingEvent->album_image) {
                    foreach ($weddingEvent->album_image as $oldImage) {
                        Storage::disk('public')->delete('invitation/albums/' . $oldImage);
                    }
                }
                $albumPath = [];
                foreach ($request->file('album_image') as $image) {
                    $fileName = time() . '_alb_' . $image->getClientOriginalName();
                    $image->storeAs('weddingevents/albums', $fileName, 'public');
                    $albumPath[] = $fileName;
                }
                $data['album_image'] = $albumPath;
            }

            // Lưu vào database
            $result = WeddingEvent::updateOrCreate(
                ['id' => $wId, 'user_id' => $userId],
                $data
            );

            return response()->json([
                'success' => true,
                'message' =>  $weddingEvent ? 'Cập nhập sự kiện thành công!' : 'Tạo sự kiện thành công!',
                'data' => $result,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $th->getMessage()
            ], 500);
        }
    }

    // Lấy chi tiết sự kiện 
    public function show(Request $request, $eventId)
    {
        // Tìm sự kiện cần chỉnh sửa 
        $weddingEvent = WeddingEvent::where('id', $eventId)->firstOrFail();

        return response()->json([
            'success' => true,
            "message" => "Lấy thông tin chi tiết sự kiện thành công!",
            'data' => $weddingEvent,
        ]);
    }

    // Xóa sự kiện 
    public function destroy(Request $request, $eventId)
    {
        try {
            // Lấy thông tin id người xóa 
            $userId = $request->user()->id;

            // Tìm bản ghi cần xóa 
            $weddingEvent = WeddingEvent::findOrFail($eventId);

            if ($weddingEvent->user_id !== $userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền xóa sự kiện này!',

                ], 403);
            }

            // Xóa ảnh bìa
            if ($weddingEvent->cover_image) {
                Storage::disk('public')->delete('weddingevents/covers/' . $weddingEvent->cover_image);
            }

            // Xóa album ảnh 
            if ($weddingEvent->album_image) {
                $album = is_array($weddingEvent->album_image) ? $weddingEvent->album_image : json_decode($weddingEvent->album_image, true);
                if (is_array($album)) {
                    foreach ($album as $image) {

                        Storage::disk('public')->delete('weddingevents/albums/' . $image);
                    }
                }
            }

            // Xóa QR ngân hàng
            if ($weddingEvent->qr_code_bank) {
                Storage::disk('public')->delete('weddingevents/qrcode/' . $weddingEvent->qr_code_bank);
            }

            // Xóa sự kiện
            $weddingEvent->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sự kiện thành công!',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => "Lỗi hệ thống" . $th->getMessage(),
            ], 500);
        }
    }
}
