<?php

namespace App\Wafer\Application\UpdateWaferStatus;

class UpdateWaferStatusCommand
{
    public function __construct(
        public readonly int     $waferId,
        public readonly string  $newStatus, // 'ok' | 'defective' | 'scrapped'
        public readonly string  $changedByEmail = 'system',
        public readonly ?string $reason = null
    )
    {
    }
}
