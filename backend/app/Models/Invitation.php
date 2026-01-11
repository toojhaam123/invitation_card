<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'guest_name',
        'groom_name',
        'bride_name',
        'phone_contacts',
        'groom_father',
        'groom_mother',
        'bride_father',
        'bride_mother',
        'event_date',
        'lunar_date',
        'location_type',
        'address',
        'map_iframe',
        'cover_image',
        'album_image',
        'music_url',
        'qr_code_bank',
        'is_published',
    ];

    // Ép kiểu dữ liệu casting cho album ảnh phải là Array 
    protected $casts = [
        'album_image' => 'array',
        'event_date' => 'datetime',
        'is_published' => 'boolean',
    ];

    // Lấy title của của thiệp
    public function getTitleAttribute()
    {
        return "{$this->groom_name} & {$this->bride_name}";
    }

    // Thiệp mời thuộc về người dùng nào 
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Một thiệp mời có nhiều lượt truy cập 
    public function logs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Lấy lời chút 
    public function guestbooks()
    {
        // Sắp xếp lời chút mới nhất lên đâud
        return $this->hasMany(Guestbook::class)->latest();
    }
}
