<?php

namespace App\Lot\Infrastructure;

use App\Lot\Domain\Lot;
use App\Lot\Domain\LotRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\LockMode;
use Doctrine\Persistence\ManagerRegistry;

class LotRepository extends ServiceEntityRepository implements LotRepositoryInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lot::class);
    }

    public function save(Lot $lot): void
    {
        $this->getEntityManager()->persist($lot);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Lot
    {
        return $this->find($id);
    }

    public function findAll(): array
    {
        return parent::findAll();
    }

    public function existByLotNumber(string $lotNumber): bool
    {
        return $this->findOneBy(['lotNumber' => $lotNumber]) !== null;
    }
}
