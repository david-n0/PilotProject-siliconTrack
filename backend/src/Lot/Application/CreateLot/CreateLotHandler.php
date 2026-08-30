<?php

namespace App\Lot\Application\CreateLot;

use App\Lot\Domain\Lot;
use App\Lot\Domain\LotRepositoryInterface;

class CreateLotHandler
{
    public function __construct(
        private readonly LotRepositoryInterface $lotRepository)
    {
    }

    public function handle(CreateLotCommand $command): void
    {
        if ($this->lotRepository->existByLotNumber($command->lotNumber)) {
            throw new \InvalidArgumentException("Lot number {$command->lotNumber} already exists!");
        } else {
            $lot = Lot::create($command->lotNumber, $command->product, $command->waferCount,  $command->createdBy);
            $this->lotRepository->save($lot);
        }

    }
}

