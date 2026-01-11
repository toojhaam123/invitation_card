<?php

namespace App\Http\Controllers;

use App\Models\Guestbook;
use Illuminate\Http\Request;

class GuestbookController extends Controller
{
    // Khách gửi lời chút mới 
    public function store(Request $request)
    {
        // chặn các từ ngữu phản cản
        $badWords = ['xấu', 'tệ', 'vl', 'dm', 'dmm', 'vcl', 'địt mẹ', 'địt cụ', 'ngu', 'ngáo', 'cút'];

        foreach ($badWords as $word) {
            if (str_contains(strtolower($request->content), $word)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lời chút chứa từ ngữ không phù hợp',
                ], 422);
            }
        }
        // Validated dữ liệu 
        $validated = $request->validate([
            'invitation_id' => 'required|exists:invitations,id',
            'guest_name' => 'required|string|max:50',
            'content' => 'required|string|max:500',
        ], [
            'invitation_id.exists' => 'Thiệp mời không tồn tại!',
            'guest_name.required' => 'Vui lòng nhập tên để tôi biết quý khách là ai!',
            'content.required' => 'Đừng quên để lại lời chúc nhé!',
        ]);

        // Lưu vào DB 
        $guestbook = Guestbook::create($validated);

        // return
        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn lời chúc tốt đẹp của quý khách!',
            'data' => $guestbook,
        ], 201);
    }
}
