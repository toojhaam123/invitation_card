<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Invitation;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    // lấy danh sách lượt xem của một thiệp mời cụ thể 
    public function getLogsByInvitation(Request $request, $invitationId)
    {
        // Kiểm tra quyền 
        $userId = $request->user()->id;
        $invitation = Invitation::where('id', $invitationId)->where('user_id', $userId)->firstOrFail();

        if (!$invitation) {
            return response()->json([
                'success' => false,
                'message' => "Không có thiệp nào!",
            ]);
        }

        // Lấy danh sách Log kèm phân trang  (20 lượt mỗi trang)
        $logs = ActivityLog::where('invitation_id', $invitationId)->orderBy('viewed_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'invitation_title' => $invitation->title,
            'data' => $logs,
        ]);
    }
}
