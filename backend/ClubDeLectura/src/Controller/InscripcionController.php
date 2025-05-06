<?php

namespace App\Controller;

use App\Entity\Inscripcion;
use App\Entity\Evento;
use App\Entity\Usuario;
use App\Repository\InscripcionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

final class InscripcionController extends AbstractController
{
    private $inscripcionRepository;
    private $entityManager;

    public function __construct(InscripcionRepository $inscripcionRepository, EntityManagerInterface $entityManager)
    {
        $this->inscripcionRepository = $inscripcionRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/inscripciones', name: 'get_inscripciones', methods: ['GET'])]
    public function getInscripciones(): JsonResponse
    {
        $inscripciones = $this->inscripcionRepository->findAll();

        $data = [];
        foreach ($inscripciones as $inscripcion) {
            $data[] = [
                'id' => $inscripcion->getId(),
                'evento' => $inscripcion->getEvento() ? $inscripcion->getEvento()->getId() : null,
                'usuario' => $inscripcion->getUsuario() ? $inscripcion->getUsuario()->getId() : null,
                'fechaInscripcion' => $inscripcion->getFechaInscripcion()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/inscripcion/{id}', name: 'get_inscripcion', methods: ['GET'])]
    public function getInscripcion(int $id): JsonResponse
    {
        $inscripcion = $this->inscripcionRepository->find($id);

        if (!$inscripcion) {
            throw new NotFoundHttpException('Inscripción no encontrada');
        }

        return $this->json([
            'id' => $inscripcion->getId(),
            'evento' => $inscripcion->getEvento() ? $inscripcion->getEvento()->getId() : null,
            'usuario' => $inscripcion->getUsuario() ? $inscripcion->getUsuario()->getId() : null,
            'fechaInscripcion' => $inscripcion->getFechaInscripcion()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/inscripcion', name: 'create_inscripcion', methods: ['POST'])]
    public function createInscripcion(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $inscripcion = new Inscripcion();
        $inscripcion->setFechaInscripcion(new \DateTimeImmutable($data['fecha_inscripcion']));

        $evento = $this->entityManager->getRepository(Evento::class)->find($data['evento_id']);
        $usuario = $this->entityManager->getRepository(Usuario::class)->find($data['usuario_id']);
        
        if ($evento && $usuario) {
            $inscripcion->setEvento($evento);
            $inscripcion->setUsuario($usuario);
        } else {
            return $this->json(['message' => 'Evento o Usuario no encontrados'], 400);
        }

        $this->entityManager->persist($inscripcion);
        $this->entityManager->flush();

        return $this->json([
            'id' => $inscripcion->getId(),
            'evento' => $inscripcion->getEvento() ? $inscripcion->getEvento()->getId() : null,
            'usuario' => $inscripcion->getUsuario() ? $inscripcion->getUsuario()->getId() : null,
            'fechaInscripcion' => $inscripcion->getFechaInscripcion()->format('Y-m-d H:i:s'),
        ], 201);
    }

    #[Route('/api/inscripcion/{id}', name: 'update_inscripcion', methods: ['PUT'])]
    public function updateInscripcion(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $inscripcion = $this->inscripcionRepository->find($id);

        if (!$inscripcion) {
            throw new NotFoundHttpException('Inscripción no encontrada');
        }

        $inscripcion->setFechaInscripcion(new \DateTimeImmutable($data['fecha_inscripcion']));

        $evento = $this->entityManager->getRepository(Evento::class)->find($data['evento_id']);
        $usuario = $this->entityManager->getRepository(Usuario::class)->find($data['usuario_id']);
        
        if ($evento && $usuario) {
            $inscripcion->setEvento($evento);
            $inscripcion->setUsuario($usuario);
        } else {
            return $this->json(['message' => 'Evento o Usuario no encontrados'], 400);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $inscripcion->getId(),
            'evento' => $inscripcion->getEvento() ? $inscripcion->getEvento()->getId() : null,
            'usuario' => $inscripcion->getUsuario() ? $inscripcion->getUsuario()->getId() : null,
            'fechaInscripcion' => $inscripcion->getFechaInscripcion()->format('Y-m-d H:i:s'),
        ]);
    }

    #[Route('/api/inscripcion/{id}', name: 'delete_inscripcion', methods: ['DELETE'])]
    public function deleteInscripcion(int $id): JsonResponse
    {
        $inscripcion = $this->inscripcionRepository->find($id);

        if (!$inscripcion) {
            throw new NotFoundHttpException('Inscripción no encontrada');
        }

        $this->entityManager->remove($inscripcion);
        $this->entityManager->flush();

        return $this->json(['message' => 'Inscripción eliminada con éxito']);
    }
}
