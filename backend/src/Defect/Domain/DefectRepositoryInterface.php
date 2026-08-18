<?php

namespace App\Defect\Domain;

interface DefectRepositoryInterface
{
    public function save(Defect $defect): void;
    public function findById(int $id): ?Defect;
    public function findByWaferId(int $waferId): array;
    public function findAll(): array;
}
