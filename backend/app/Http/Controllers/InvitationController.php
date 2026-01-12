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
    public function index(Request $request, $id)
    {
        // Lấy Id user người dùng hiện tại 
        $userId = $request->user()->id;

        $invitation = Invitation::where('id', $id)->where('user_id', $userId)->firstOrFail()->get();

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
