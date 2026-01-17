<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guestbook extends Model
{
    use HasFactory;

    protected $fillable = ['invitation_id', 'name', 'content'];


    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }
}
