<?php

namespace App\Wafer\Domain;

interface WaferRepositoryInterface
{
    public function save(Wafer $wafer): void;
    public function findAll(): array;
    public function findById(int $id): ?Wafer;
    // Vraca sve plocice koje pripadaju određenom Lot-u
    public function findByLotId(int $id): array;
    public function existsBySerialNumber(string $serialNumber): bool;

}
