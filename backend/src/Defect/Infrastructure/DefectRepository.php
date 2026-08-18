<?php

namespace App\Defect\Infrastructure;

use App\Defect\Domain\Defect;
use App\Defect\Domain\DefectRepositoryInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DefectRepository extends ServiceEntityRepository implements DefectRepositoryInterface
{


    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Defect::class);
    }

    public function save(Defect $defect): void
    {
        $this->getEntityManager()->persist($defect);
        $this->getEntityManager()->flush();
    }

    public function findById(int $id): ?Defect
    {
        return $this->find($id);
    }

    public function findAll(): array
    {
        return parent::findAll();
    }

    public function findByWaferId(int $waferId): array
    {
        return $this->findBy(['wafer' => $waferId], ['detectedAt' => 'DESC']);
    }
}
