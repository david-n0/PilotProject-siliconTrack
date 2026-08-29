<?php

namespace App\Lot\Application\AutoHold;

class AutoHoldResult
{
    public function __construct(
        public readonly int    $lotId,
        public readonly float  $yieldPercent,
        public readonly string $note,
    )
    {
    }
}
