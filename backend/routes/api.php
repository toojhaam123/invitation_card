<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GuestbookController;
use App\Http\Controllers\WeddingEventController;

Route::prefix('v1')->group(function () {
    // Đăng ký tài khoản người dùng
    Route::post('/register', [AuthController::class, 'register']);
    // Login
    Route::post('/login', [AuthController::class, 'login']);

    // Route cho khách xem chi tiết thiệp mời
    Route::get('/invitations/{weddingSlug}/{guestNameSlug}', [InvitationController::class, 'show']);

    // Xác nhận tham gia 
    Route::post('/{weddingSlug}/{guestNameSlug}/respond', [InvitationController::class, 'respond']);

    // Route thêm lời chúc của khách 
    Route::post('wedding/{weddingSlug}/{guestNameSlug}/guestbook', [GuestbookController::class, 'store'])
        ->middleware('throttle:guestbook_spam');

    // -------- Nhóm các API quản lý (Cần đăng nhập) ------
    Route::middleware('auth:sanctum')->group(function () {
        // Route lấy thông tin user đang đăng nhập và đăng xuất
        Route::get('/me', function (Request $request) {
            return $request->user();
        });
        Route::post('/logout', [AuthController::class, 'logout']);

        // Quản lý sự kiện 
        Route::post('/events', [WeddingEventController::class, 'storeOrUpdate']);
        Route::get('/events', [WeddingEventController::class, 'index']);          // Xem danh sách thiệp của tôi
        Route::get('/events/{eventId}', [WeddingEventController::class, 'show']); // Lấy chi tiết sự kiện để chỉnh sửa
        Route::delete('/delete/wedding-event/{eventId}', [WeddingEventController::class, 'destroy']);

        // Quản lý thiệp mời
        Route::post('event/invitations/{weddingSlug}', [InvitationController::class, 'storeOrUpdate']); // Thêm thiệp mời của tôi
        Route::get('event/invitations/{weddingSlug}', [InvitationController::class, 'index']);          // Xem danh sách thiệp của tôi
        Route::delete('delete/invitation/{invitationId}', [InvitationController::class, 'destroy']);
        Route::get('/{weddingSlug}/{guestNameSlug}/edit-invitation/{invitationId}', [InvitationController::class, 'showToEdit']);

        // Xem lịch sử truy cập của thiệp
        Route::get('/invitations/{id}/logs', [ActivityLogController::class, 'getLogsByInvitation']);

        // Chủ thiệp có thể xóa các lời chút không phù hợp 
        Route::delete('/guestbook/{id}', [GuestbookController::class, 'destroy']);
    });
});
