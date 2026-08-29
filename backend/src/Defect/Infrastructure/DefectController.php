<?php

namespace App\Defect\Infrastructure;

use App\Defect\Application\LogDefect\LogDefectCommand;
use App\Defect\Application\LogDefect\LogDefectHandler;
use App\Defect\Domain\Defect;
use App\Defect\Domain\DefectRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class DefectController extends AbstractController
{
    // GET /api/defects — svi defekti u sistemu
    #[Route('/defects', methods: ['GET'])]
    public function index(DefectRepositoryInterface $repo): JsonResponse
    {
        $defects = $repo->findAll();

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'waferId' => $d->getWafer()->getId(),
            'waferSerial' => $d->getWafer()->getSerialNumber(),
            'lotNumber' => $d->getWafer()->getLot()->getLotNumber(),
            'type' => $d->getType()->value,
            'severity' => $d->getSeverity()->value,
            'dieCol' => $d->getDieCol(),
            'description' => $d->getDescription(),
            'detectedAt' => $d->getDetectedAt()->format('H:i d-m-Y'),
        ], $defects);

        return $this->json($data);
    }

    // GET /api/wafers/{waferId}/defects — svi defekti za jednu plocicu
    #[Route('/wafers/{waferId}/defects', methods: ['GET'])]
    public function getByWafer(int $waferId, DefectRepositoryInterface $repo): JsonResponse
    {
        $defects = $repo->findByWaferId($waferId);

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'waferId' => $d->getWafer()->getId(),
            'waferSerial' => $d->getWafer()->getSerialNumber(),
            'lotNumber' => $d->getWafer()->getLot()->getLotNumber(),
            'type' => $d->getType()->value,
            'severity' => $d->getSeverity()->value,
            'dieRow' => $d->getDieRow(),
            'dieCol' => $d->getDieCol(),
            'description' => $d->getDescription(),
            'detectedAt' => $d->getDetectedAt()->format('H:i d-m-Y'),
        ], $defects);

        return $this->json($data);
    }

    // POST /api/defects — zabeleži novi defekt
    #[Route('/defects', methods: ['POST'])]
    public function log(Request $request, LogDefectHandler $handler): JsonResponse
    {
        $body = json_decode($request->getContent(), true);

        try {
            $autoHold = $handler->handle(new LogDefectCommand(
                (int)($body['waferId'] ?? 0),
                $body['type'] ?? '',
                $body['severity'] ?? '',
                (int)($body['dieRow'] ?? 0),
                (int)($body['dieCol'] ?? 0),
                $body['description'] ?? null,
                $this->getUser()?->getUserIdentifier() ?? 'system',
            ));

            return $this->json([
                'message' => 'Defect logged. Wafer status set to defective.',
                'autoHold' => $autoHold === null ? null : [
                    'lotId' => $autoHold->lotId,
                    'yield' => $autoHold->yieldPercent,
                    'note' => $autoHold->note,
                ],
            ], Response::HTTP_CREATED);

        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\ValueError $e) {
            return $this->json(['error' => 'Invalid type or severity value.'], Response::HTTP_BAD_REQUEST);
        }
    }

    // DELETE /api/defects/{id} — obriši defekt
    #[Route('/defects/{id}', methods: ['DELETE'])]
    public function delete(int $id, DefectRepositoryInterface $repo, EntityManagerInterface $em): JsonResponse
    {
        $defect = $repo->findById($id);
        if (!$defect) {
            return $this->json(['error' => 'Defect not found.'], Response::HTTP_NOT_FOUND);
        }
        $em->remove($defect);
        $em->flush();
        return $this->json(['message' => 'Defect deleted.']);
    }
}
