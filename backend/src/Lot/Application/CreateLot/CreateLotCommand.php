<?php

namespace App\Lot\Application\CreateLot;

class CreateLotCommand
{
    public function __construct(
        public readonly string $lotNumber,
        public readonly string $product,
        public readonly int $waferCount,
    )
    {
    }

}
