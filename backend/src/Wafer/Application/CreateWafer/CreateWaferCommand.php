<?php

namespace App\Wafer\Application\CreateWafer;

class CreateWaferCommand
{
    public function __construct(
        public readonly string $serialNumber,
        public readonly int    $position,
        public readonly int    $lotId,
    )
    {
    }
}
