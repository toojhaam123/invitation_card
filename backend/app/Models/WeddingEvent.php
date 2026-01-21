<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingEvent extends Model
{
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

    // Sự kiện thuộc về người dùng nào 
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Một sự kiện có nhiều thiệp mời
    public function invitations(): HasMany
    {
        return $this->hasMany(Invitation::class, "wedding_event_slug", 'slug');
    }
}
