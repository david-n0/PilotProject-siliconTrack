<?php

namespace App\Wafer\Infrastructure;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Wafer\Application\CreateWafer\CreateWaferCommand;
use App\Wafer\Application\CreateWafer\CreateWaferHandler;
use App\Wafer\Application\UpdateWaferStatus\UpdateWaferStatusCommand;
use App\Wafer\Application\UpdateWaferStatus\UpdateWaferStatusHandler;
use App\Wafer\Domain\WaferRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route(path: '/api')]
class WaferController extends AbstractController
{

    // GET /api/wafers (ili /api/wafers?lotId=5)

    #[Route('/wafers', methods: ['GET'])]
    public function index(Request $request, WaferRepositoryInterface $repo): JsonResponse
    {
        $lotId = $request->query->get('lotId');
        $wafers = $lotId !== null
            ? $repo->findByLotId((int)$lotId)
            : $repo->findAll();
        $data = array_map(fn($w) => [
            'id' => $w->getId(),
            'serialNumber' => $w->getSerialNumber(),
            'position' => $w->getPosition(),
            'status' => $w->getStatus()->value,
            'lotId' => $w->getLot()->getId(),
            'lotNumber' => $w->getLot()->getLotNumber(),
            'createdAt' => $w->getCreatedAt()->format('H:i d-m-Y'),
        ], $wafers);
        return $this->json($data);
    }

    // GET /api/lots/{lotId}/wafers - pogodnost za ucitavanje svih plocica za jedan Lot

    #[Route('/lots/{lotId}/wafers', methods: ['GET'])]
    public function getByLot(int $lotId, WaferRepositoryInterface $repo): JsonResponse
    {
        $wafers = $repo->findByLotId($lotId);
        $data = array_map(fn($w) => [
            'id' => $w->getId(),
            'serialNumber' => $w->getSerialNumber(),
            'position' => $w->getPosition(),
            'status' => $w->getStatus()->value,
            'lotId' => $w->getLot()->getId(),
            'lotNumber' => $w->getLot()->getLotNumber(),
            'createdAt' => $w->getCreatedAt()->format('H:i d-m-Y'),
        ], $wafers);
        return $this->json($data);
    }

    // POST /api/wafers

    #[Route('/wafers', methods: ['POST'])]
    public function create(Request $request, CreateWaferHandler $handler): JsonResponse
    {
        $body = json_decode($request->getContent(), true);
        try {
            $handler->handle(new CreateWaferCommand(
                $body['serialNumber'] ?? '',
                (int)($body['position'] ?? 0),
                (int)($body['lotId'] ?? 0),
            ));
            return $this->json(['message' => 'Wafer created.'], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    // GET /api/wafers/{id}

    #[Route('/wafers/{id}', methods: ['GET'])]
    public function show(int $id, WaferRepositoryInterface $repo): JsonResponse
    {
        $wafer = $repo->findById($id);
        if (!$wafer) {
            return $this->json(['error' => "Wafer #{$id} not found"], Response::HTTP_NOT_FOUND);
        }
        return $this->json([
            'id' => $wafer->getId(),
            'serialNumber' => $wafer->getSerialNumber(),
            'position' => $wafer->getPosition(),
            'status' => $wafer->getStatus()->value,
            'lotId' => $wafer->getLot()->getId(),
            'lotNumber' => $wafer->getLot()->getLotNumber(),
            'createdAt' => $wafer->getCreatedAt()->format('H:i d-m-Y'),
        ]);
    }

    //  PATCH /api/wafers/{id}/status

    #[Route('/wafers/{id}/status', methods: ['PATCH'])]
    public function updateStatus(int $id, Request $request, UpdateWaferStatusHandler $handler): JsonResponse
    {
        $body = json_decode($request->getContent(), true);
        try {
            $handler->handle(new UpdateWaferStatusCommand($id, $body['status'] ?? ''));
            return $this->json(['message' => 'Wafer status updated.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\ValueError $e) {
            return $this->json(['error' => 'Invalid status value.'], Response::HTTP_BAD_REQUEST);
        }
    }

    // DELETE /api/wafers/{id}

    #[Route('/wafers/{id}', methods: ['DELETE'])]
    public function delete(int $id, WaferRepositoryInterface $repo, EntityManagerInterface $em): JsonResponse
    {
        $wafer = $repo->findById($id);
        if (!$wafer) {
            return $this->json(['error' => 'Wafer not found'], Response::HTTP_NOT_FOUND);
        }
        $em->remove($wafer);
        $em->flush();
        return $this->json(['message' => 'Wafer deleted.']);
    }
}
