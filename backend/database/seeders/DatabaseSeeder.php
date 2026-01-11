<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Invitation;
use App\Models\ActivityLog;
use App\Models\Guestbook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo 1 User mẫu để đăng nhập
        $user = User::create([
            'name' => 'Tùng Admin',
            'email' => 'tung@example.com',
            'password' => Hash::make('123456'),
        ]);

        // 2. Tạo 1 thiệp mời mẫu
        $invitation = Invitation::create([
            'user_id' => $user->id,
            'slug' => 'nguyen-van-a',
            'guest_name' => 'Nguyễn Văn A',
            'groom_name' => 'Hạng Tùng',
            'bride_name' => 'Sùng Đới',
            'event_date' => now()->addDays(30),
            'location_type' => 'nhà hàng',
            'address' => 'Hấu Chua - Sín Chải - Điện Biên',
            'is_published' => true,
        ]);

        // Người dùng 2 
        $user = User::create([
            'name' => 'doi',
            'email' => 'doi@example.com',
            'password' => Hash::make('123456'),
        ]);

        // 2. Tạo 1 thiệp mời mẫu
        $invitation = Invitation::create([
            'user_id' => $user->id,
            'slug' => 'nguyen-van-b',
            'guest_name' => 'Nguyễn Văn B',
            'groom_name' => 'Hạng Tùng',
            'bride_name' => 'Sùng Đới',
            'event_date' => now()->addDays(30),
            'location_type' => 'nhà hàng',
            'address' => 'Hấu Chua - Sín Chải - Điện Biên',
            'is_published' => true,
        ]);

        // 3. Tạo vài lời chúc mẫu (Guestbook)
        Guestbook::create([
            'invitation_id' => $invitation->id,
            'guest_name' => 'Anh Tuấn',
            'content' => 'Chúc hai bạn trăm năm hạnh phúc nhé!',
        ]);

        Guestbook::create([
            'invitation_id' => $invitation->id,
            'guest_name' => 'Chị Hoa',
            'content' => 'Thiệp đẹp quá, chúc mừng gia đình!',
        ]);

        // 4. Tạo vài lịch sử xem mẫu (Activity Logs)
        ActivityLog::create([
            'invitation_id' => $invitation->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
            'viewed_at' => now()->subHours(2),
        ]);
    }
}
