<?php

namespace App\Controller;

use App\Entity\Evento;
use App\Entity\Usuario;
use App\Repository\EventoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

final class EventoController extends AbstractController
{
    private $eventoRepository;
    private $entityManager;

    public function __construct(EventoRepository $eventoRepository, EntityManagerInterface $entityManager)
    {
        $this->eventoRepository = $eventoRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/eventos', name: 'get_eventos', methods: ['GET'])]
    public function getEventos(): JsonResponse
    {
        try {
            $eventos = $this->eventoRepository->findAll();

            $data = [];
            foreach ($eventos as $evento) {
                try {
                    $organizador = $evento->getOrganizador();
                    $organizadorData = $organizador ? [
                        'id' => $organizador->getId(),
                        'nombre' => $organizador->getNombre()
                    ] : ['id' => null, 'nombre' => 'Sin organizador'];
                } catch (\Exception $e) {
                    $organizadorData = ['id' => null, 'nombre' => 'Sin organizador'];
                }

                $data[] = [
                    'id' => $evento->getId(),
                    'titulo' => $evento->getTitulo(),
                    'descripcion' => $evento->getDescripcion(),
                    'fecha' => $evento->getFecha()->format('Y-m-d H:i:s'),
                    'ubicacion' => $evento->getUbicacion(),
                    'organizador' => $organizadorData
                ];
            }

            return $this->json($data);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al cargar los eventos'], 500);
        }
    }

    #[Route('/api/evento/{id}', name: 'get_evento', methods: ['GET'])]
    public function getEvento(int $id): JsonResponse
    {
        try {
            $evento = $this->eventoRepository->find($id);

            if (!$evento) {
                throw new NotFoundHttpException('Evento no encontrado');
            }

            try {
                $organizador = $evento->getOrganizador();
                $organizadorData = $organizador ? [
                    'id' => $organizador->getId(),
                    'nombre' => $organizador->getNombre()
                ] : ['id' => null, 'nombre' => 'Sin organizador'];
            } catch (\Exception $e) {
                $organizadorData = ['id' => null, 'nombre' => 'Sin organizador'];
            }

            return $this->json([
                'id' => $evento->getId(),
                'titulo' => $evento->getTitulo(),
                'descripcion' => $evento->getDescripcion(),
                'fecha' => $evento->getFecha()->format('Y-m-d H:i:s'),
                'ubicacion' => $evento->getUbicacion(),
                'organizador' => $organizadorData
            ]);
        } catch (NotFoundHttpException $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al cargar el evento'], 500);
        }
    }

    #[Route('/api/evento', name: 'create_evento', methods: ['POST'])]
    public function createEvento(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $evento = new Evento();
        $evento->setTitulo($data['titulo']);
        $evento->setDescripcion($data['descripcion']);
        $evento->setFecha(new \DateTime($data['fecha']));
        $evento->setUbicacion($data['ubicacion']);
        
        $organizador = $this->entityManager->getRepository(Usuario::class)->find($data['organizador_id']);
        if ($organizador) {
            $evento->setOrganizador($organizador);
        }

        $this->entityManager->persist($evento);
        $this->entityManager->flush();

        return $this->json([
            'id' => $evento->getId(),
            'titulo' => $evento->getTitulo(),
            'descripcion' => $evento->getDescripcion(),
            'fecha' => $evento->getFecha()->format('Y-m-d H:i:s'),
            'ubicacion' => $evento->getUbicacion(),
            'organizador' => $evento->getOrganizador() ? $evento->getOrganizador()->getId() : null,
        ], 201);
    }

    #[Route('/api/evento/{id}', name: 'update_evento', methods: ['PUT'])]
    public function updateEvento(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $evento = $this->eventoRepository->find($id);

        if (!$evento) {
            throw new NotFoundHttpException('Evento no encontrado');
        }

        $evento->setTitulo($data['titulo']);
        $evento->setDescripcion($data['descripcion']);
        $evento->setFecha(new \DateTime($data['fecha']));
        $evento->setUbicacion($data['ubicacion']);

        $organizador = $this->entityManager->getRepository(Usuario::class)->find($data['organizador_id']);
        if ($organizador) {
            $evento->setOrganizador($organizador);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $evento->getId(),
            'titulo' => $evento->getTitulo(),
            'descripcion' => $evento->getDescripcion(),
            'fecha' => $evento->getFecha()->format('Y-m-d H:i:s'),
            'ubicacion' => $evento->getUbicacion(),
            'organizador' => $evento->getOrganizador() ? $evento->getOrganizador()->getId() : null,
        ]);
    }

    #[Route('/api/evento/{id}', name: 'delete_evento', methods: ['DELETE'])]
    public function deleteEvento(int $id): JsonResponse
    {
        $evento = $this->eventoRepository->find($id);

        if (!$evento) {
            throw new NotFoundHttpException('Evento no encontrado');
        }

        $this->entityManager->remove($evento);
        $this->entityManager->flush();

        return $this->json(['message' => 'Evento eliminado con éxito']);
    }
}
