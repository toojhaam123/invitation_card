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
        'wedding_event_slug',
        'guest_name',
        'slug',
        'is_attended',
    ];

    /**
     * Một thiệp mời thuộc về một sự kiện đám cưới
     */
    public function weddingEvent(): BelongsTo
    {
        // Laravel sẽ tự tìm cột wedding_event_slug để nối với bảng wedding_events
        return $this->belongsTo(WeddingEvent::class, 'wedding_event_slug', 'slug');
    }

    // Một thiệp mời có nhiều lượt truy cập 
    public function logs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Lấy title của của thiệp
    public function getTitleAttribute()
    {
        return "{$this->groom_name} & {$this->bride_name}";
    }

    // Lấy lời chút 
    public function guestbooks()
    {
        // Sắp xếp lời chút mới nhất lên đâud
        return $this->hasMany(Guestbook::class)->latest();
    }
}
