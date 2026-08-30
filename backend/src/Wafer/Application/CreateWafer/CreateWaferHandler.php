<?php

namespace App\Wafer\Application\CreateWafer;

use App\Lot\Domain\LotRepositoryInterface;
use App\Wafer\Domain\Wafer;
use App\Wafer\Domain\WaferRepositoryInterface;

class CreateWaferHandler
{

    public function __construct(
        private readonly WaferRepositoryInterface $waferRepository,
        private readonly LotRepositoryInterface   $lotRepository)
    {
    }

    public function handle(CreateWaferCommand $command): void
    {
        // 1. Proverava da li Lot poostoji u bazi
        $lot = $this->lotRepository->findById($command->lotId);
        if ($lot === null) {
            throw new \InvalidArgumentException("Lot with id {$command->lotId} not found");
        }

        // 2. Proverava da li vec postoji plocica sa istim serijskim brojem
        if ($this->waferRepository->existsBySerialNumber($command->serialNumber)) {
            throw new \InvalidArgumentException("Wafer with serial number {$command->serialNumber} already exists");
        }

        // 3. Kreiranje i cuvanje
        $wafer = Wafer::create($command->serialNumber, $command->position, $lot);
        $this->waferRepository->save($wafer);
    }
}
