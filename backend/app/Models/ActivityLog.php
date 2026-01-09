<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'invitation_id',
        'ip_address',
        'user_agent',
        'viewed_at'
    ];

    // Ép kiểu viewed_at về kiểu thời gian 
    protected $casts = [
        'viewed_at' => 'datetime',
    ];


    // Mỗi log thuộc về một thiệp mời cụ thể

    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }
}
