<?php

namespace App\Lot\Infrastructure;

use App\Lot\Application\CreateLot\CreateLotCommand;
use App\Lot\Application\CreateLot\CreateLotHandler;
use App\Lot\Application\UpdateLotStatus\UpdateLotStatusCommand;
use App\Lot\Application\UpdateLotStatus\UpdateLotStatusHandler;
use App\Lot\Domain\LotRepositoryInterface;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Config\Doctrine\Orm\EntityManagerConfig;

#[Route('/api/lots')]
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class LotController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(LotRepositoryInterface $repo): JsonResponse
    {
        $lots = $repo->findAll();
        $data = array_map(fn($lot) => [
            'id' => $lot->getId(),
            'lotNumber' => $lot->getLotNumber(),
            'product' => $lot->getProduct(),
            'waferCount' => $lot->getWaferCount(),
            'status' => $lot->getStatus()->value,
            'startedAt' => $lot->getStartedAt()->format('H:i d-m-Y'),
            'completedAt' => $lot->getCompletedAt()?->format('H:i d-m-Y'),
        ], $lots);

        return $this->json($data);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, CreateLotHandler $handler): JsonResponse
    {
        $body = json_decode($request->getContent(), true);
        $handler->handle(new CreateLotCommand(
            $body['lotNumber'] ?? '',
            $body['product'] ?? '',
            $body['waferCount'] ?? 0,
        ));

        return $this->json(['message' => 'Lot created'], Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getLot(int $id, LotRepositoryInterface $repo): JsonResponse
    {
        $lot = $repo->findById($id);
        if (!$lot) {
            return $this->json(['error' => 'Not found by id: {$id}'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $lot->getId(),
            'lotNumber' => $lot->getLotNumber(),
            'product' => $lot->getProduct(),
            'waferCount' => $lot->getWaferCount(),
            'status' => $lot->getStatus()->value,
            'startedAt' => $lot->getStartedAt()->format('H:i d-m-Y'),
            'completedAt' => $lot->getCompletedAt()?->format('H:i d-m-Y'),
        ]);
    }

    #[Route('/{id}/status', methods: ['PATCH'])]
    public function updateStatus(int $id, Request $request, UpdateLotStatusHandler $handler): JsonResponse
    {
        $body = json_decode($request->getContent(), true);

        $currentUser = $this->getUser();
        try {
            $handler->handle(new UpdateLotStatusCommand(
                lotId: $id,
                newStatus: $body['status'] ?? '',
                changedByEmail: $currentUser?->getUserIdentifier() ?? 'system',
                note: $body['note'] ?? null,
            ));
            return $this->json(['message' => 'Status updated successfully.']);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\ValueError $e) {
            return $this->json(['error' => 'Invalid status value.'], Response::HTTP_BAD_REQUEST);
        }
    }

    // GET /api/lots/{id}/history — dohvati sve revizorske zapise za ovaj Lot
    #[Route('/{id}/history', methods: ['GET'])]
    public function history(int $id, LotRepositoryInterface $repo): JsonResponse
    {
        $entries = $repo->findHistoryByLotId($id);
        $data = array_map(fn($h) => [
            'id' => $h->getId(),
            'fromStatus' => $h->getFromStatus(),
            'toStatus' => $h->getToStatus(),
            'changedByEmail' => $h->getChangedByEmail(),
            'changedAt' => $h->getChangedAt()->format('H:i d-m-Y'),
            'note' => $h->getNote(),
        ], $entries);
        return $this->json($data);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, LotRepositoryInterface $repo, EntityManagerInterface $entityManager): JsonResponse
    {
        $lot = $repo->findById($id);
        if (!$lot) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }
        $entityManager->remove($lot);
        $entityManager->flush();

        return $this->json(['message' => 'Lot deleted!']);
    }
}
