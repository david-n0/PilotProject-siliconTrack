<?php

namespace App\Wafer\Infrastructure;

use App\Wafer\Domain\Wafer;
use App\Wafer\Domain\WaferRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class WaferRepository extends ServiceEntityRepository implements WaferRepositoryInterface
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Wafer::class);
    }

    public function save(Wafer $wafer): void
    {
        $this->getEntityManager()->persist($wafer);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Wafer
    {
        return $this->find($id);
    }

    public function findAll(): array
    {
        return parent::findAll();
    }

    public function findByLotId(int $lotId): array
    {
        return $this->findBy(['lot' => $lotId], ['position' => 'ASC']);
    }

    public function existsBySerialNumber(string $serialNumber): bool
    {
        return $this->findOneBy(['serialNumber' => $serialNumber]) !== null;
    }
}
