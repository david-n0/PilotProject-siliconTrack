<?php

namespace App\Lot\Application\UpdateLotStatus;

class UpdateLotStatusCommand
{

    public function __construct(
        public readonly int $lotId,
        public readonly string $newStatus,
        public readonly string  $changedByEmail,
        public readonly ?string $note = null,
    )
    {
    }
}
