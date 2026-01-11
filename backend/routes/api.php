<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestbookController;

Route::prefix('v1')->group(function () {
    // Đăng ký tài khoản người dùng
    Route::post('/register', [AuthController::class, 'register']);
    // Login
    Route::post('/login', [AuthController::class, 'login']);

    // Route cho khách xem thiệp
    Route::get('/invitations/{slug}', [InvitationController::class, 'show']);

    // Route thêm lời chúc của khách 
    Route::post('/guestbook', [GuestbookController::class, 'store'])
        ->middleware('throttle:guestbook_spam');

    // -------- Nhóm các API quản lý (Cần đăng nhập) ------
    Route::middleware('auth:sanctum')->group(function () {
        // Route lấy thông tin user đang đăng nhập và đăng xuất
        Route::get('/me', function (Request $request) {
            return $request->user();
        });
        Route::post('/logout', [AuthController::class, 'logout']);

        // Quản lý thiệp mời
        Route::post('/invitations', [InvitationController::class, 'storeOrUpdate']); // Thêm thiệp mời của tôi
        Route::get('/invitations', [InvitationController::class, 'index']);          // Xem danh sách thiệp của tôi

        // Xem lịch sử truy cập của thiệp
        Route::get('/invitations/{id}/logs', [ActivityLogController::class, 'getLogsByInvitation']);

        // Chủ thiệp có thể xóa các lời chút không phù hợp 
        Route::delete('/guestbook/{id}', [GuestbookController::class, 'destroy']);
    });
});
