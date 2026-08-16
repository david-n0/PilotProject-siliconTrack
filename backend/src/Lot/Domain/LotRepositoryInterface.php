<?php

namespace App\Lot\Domain;

interface LotRepositoryInterface
{
    public function save(Lot $lot): void;
    public function findAll(): array;
    public function findById(int $id): ?Lot;
    public function existByLotNumber(string $lotNumber): bool;
}
