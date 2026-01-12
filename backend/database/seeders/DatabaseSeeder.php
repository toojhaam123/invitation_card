<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Invitation;
use App\Models\ActivityLog;
use App\Models\Guestbook;
use App\Models\WeddingEvent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo 2 User
        $user1 = User::create([
            'name' => 'toojhaam',
            'email' => 'tung@example.com',
            'password' => Hash::make('123456'),
        ]);

        $user2 = User::create([
            'name' => 'sungdoi',
            'email' => 'doi@example.com',
            'password' => Hash::make('123456'),
        ]);

        // 2. Tạo 1 Sự kiện đám cưới (Gắn cho User 1)
        $weddingEvent = WeddingEvent::create([
            'user_id' => $user1->id,
            'slug' => 'tung-doi',
            'groom_name' => 'Hạng Tùng',
            'bride_name' => 'Sùng Đới',
            'event_date' => now()->addDays(30),
            'location_type' => 'nhà hàng',
            'address' => 'Hấu Chua - Sín Chải - Điện Biên',
            'is_published' => true,
        ]);

        // 3. Tạo 2 Thiệp mời cho 2 khách khác nhau thuộc sự kiện trên
        // Thiệp 1: Cho Anh Tuấn
        $invite1 = Invitation::create([
            'wedding_event_id' => $weddingEvent->id,
            'guest_name' => 'Anh Tuấn',
            'slug' => 'dam-cuoi-tung-doi-anh-tuan',
            'avatar' => null,
        ]);

        // Thiệp 2: Cho Chị Hoa
        $invite2 = Invitation::create([
            'wedding_event_id' => $weddingEvent->id,
            'guest_name' => 'Chị Hoa',
            'slug' => 'dam-cuoi-tung-doi-chi-hoa',
            'avatar' => null,
        ]);

        // 4. Tạo lời chúc mẫu cho từng thiệp (Guestbook)
        Guestbook::create([
            'invitation_id' => $invite1->id,
            'guest_name' => 'Anh Tuấn',
            'content' => 'Chúc hai bạn trăm năm hạnh phúc nhé!',
        ]);

        Guestbook::create([
            'invitation_id' => $invite2->id,
            'guest_name' => 'Chị Hoa',
            'content' => 'Thiệp đẹp quá, chúc mừng gia đình!',
        ]);

        // 5. Tạo lịch sử xem mẫu (Activity Logs) cho thiệp 1
        ActivityLog::create([
            'invitation_id' => $invite1->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Mozilla/5.0 Chrome/120.0.0.0',
            'viewed_at' => now(),
        ]);
    }
}
