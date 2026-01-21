<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wedding_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');  // Người tạo thiệp để quản lý thiệp của mình
            $table->string('slug')->unique();   // Dùng để làm link thiệp

            // Thông tin cô dâu, chú rể
            $table->string('groom_name');
            $table->string('bride_name');
            $table->string('phone_contacts')->nullable();

            // Thông tin bố mẹ
            $table->string('groom_father')->nullable();
            $table->string('groom_mother')->nullable();
            $table->string('bride_father')->nullable();
            $table->string('bride_mother')->nullable();

            // Thời gian 
            $table->dateTime('event_date'); // Ngày và giờ dương lịch 
            $table->string('lunar_date')->nullable();  // Ngày giờ Âm lịch

            // Địa điểm và phân loại
            $table->enum('location_type', ['nhà trai', 'nhà gái', 'nhà hàng'])->default('nhà hàng');
            $table->string('address'); // Địa chỉ cụ thể
            $table->text('map_iframe')->nullable(); // Link GG map

            // Hình ảnh và album cưới 
            $table->string('cover_image')->nullable(); // Ảnh nền 
            $table->json('album_image')->nullable(); // Album ảnh cưới 

            // Cáu hình thêm
            $table->string('qr_code_bank')->nullable(); // QR mừng cưới
            $table->boolean('is_published')->default(true); // Ẩn hiện thiệp
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wedding_events');
    }
};
