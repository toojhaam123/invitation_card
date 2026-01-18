<?php

namespace App\Http\Controllers;

use App\Models\Guestbook;
use App\Models\Invitation;
use Illuminate\Http\Request;

class GuestbookController extends Controller
{
    // Khách gửi lời chút mới 
    public function store(Request $request, $wddingSlug, $guestNameSlug)
    {
        // chặn các từ ngữu phản cản
        $badWords = ['xấu', 'tệ', 'vl', 'dm', 'dmm', 'vcl', 'địt mẹ', 'địt cụ', 'ngu', 'ngáo', 'cút'];

        foreach ($badWords as $word) {
            if (str_contains(strtolower($request->content), $word)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lời chúc chứa từ ngữ không phù hợp',
                ], 422);
            }
        }

        // Tìm thiệp
        $invitation = Invitation::where('wedding_event_slug', $wddingSlug)
            ->where('slug', $guestNameSlug)->firstOrFail();

        // Validated dữ liệu 
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'content' => 'required|string|max:500',
        ], [
            'invitation_id.exists' => 'Thiệp mời không tồn tại!',
            'content.required' => 'Quý khách đừng quên nhập lời chúc trước khi gửi!',
        ]);

        // Lưu vào DB 
        $guestbook = Guestbook::create([
            'invitation_id' => $invitation->id,
            'name' => $validated['name'],
            'content' => $validated['content'],
        ]);

        // return
        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn lời chúc tốt đẹp của quý khách!',
            'data' => $guestbook,
        ], 201);
    }
}
