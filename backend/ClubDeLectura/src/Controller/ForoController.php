<?php

namespace App\Controller;

use App\Entity\Foro;
use App\Entity\Usuario;
use App\Repository\ForoRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

final class ForoController extends AbstractController
{
    private $foroRepository;
    private $entityManager;

    public function __construct(ForoRepository $foroRepository, EntityManagerInterface $entityManager)
    {
        $this->foroRepository = $foroRepository;
        $this->entityManager = $entityManager;
    }

    #[Route('/api/foros', name: 'get_foros', methods: ['GET'])]
    public function getForos(): JsonResponse
    {
        try {
            $foros = $this->foroRepository->findAll();

            $data = [];
            foreach ($foros as $foro) {
                try {
                    $admin = $foro->getAdmin();
                    $adminData = $admin ? [
                        'id' => $admin->getId(),
                        'nombre' => $admin->getNombre()
                    ] : ['id' => null, 'nombre' => 'Sin administrador'];
                } catch (\Exception $e) {
                    $adminData = ['id' => null, 'nombre' => 'Sin administrador'];
                }

                $data[] = [
                    'id' => $foro->getId(),
                    'titulo' => $foro->getTitulo(),
                    'descripcion' => $foro->getDescripcion(),
                    'fechaCreacion' => $foro->getFechaCreacion()->format('Y-m-d H:i:s'),
                    'admin' => $adminData
                ];
            }

            return $this->json($data);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al cargar los foros'], 500);
        }
    }

    #[Route('/api/foro/{id}', name: 'get_foro', methods: ['GET'])]
    public function getForo(int $id): JsonResponse
    {
        try {
            $foro = $this->foroRepository->find($id);

            if (!$foro) {
                throw new NotFoundHttpException('Foro no encontrado');
            }

            try {
                $admin = $foro->getAdmin();
                $adminData = $admin ? [
                    'id' => $admin->getId(),
                    'nombre' => $admin->getNombre()
                ] : ['id' => null, 'nombre' => 'Sin administrador'];
            } catch (\Exception $e) {
                $adminData = ['id' => null, 'nombre' => 'Sin administrador'];
            }

            return $this->json([
                'id' => $foro->getId(),
                'titulo' => $foro->getTitulo(),
                'descripcion' => $foro->getDescripcion(),
                'fechaCreacion' => $foro->getFechaCreacion()->format('Y-m-d H:i:s'),
                'admin' => $adminData
            ]);
        } catch (NotFoundHttpException $e) {
            return $this->json(['error' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Error al cargar el foro'], 500);
        }
    }

    #[Route('/api/foro', name: 'create_foro', methods: ['POST'])]
    public function createForo(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $foro = new Foro();
        $foro->setTitulo($data['titulo']);
        $foro->setDescripcion($data['descripcion']);
        $foro->setFechaCreacion(new \DateTimeImmutable($data['fecha_creacion']));
        
        $admin = $this->entityManager->getRepository(Usuario::class)->find($data['admin_id']);
        if ($admin) {
            $foro->setAdmin($admin);
        }

        $this->entityManager->persist($foro);
        $this->entityManager->flush();

        return $this->json([
            'id' => $foro->getId(),
            'titulo' => $foro->getTitulo(),
            'descripcion' => $foro->getDescripcion(),
            'fechaCreacion' => $foro->getFechaCreacion()->format('Y-m-d H:i:s'),
            'admin' => $foro->getAdmin() ? $foro->getAdmin()->getId() : null,
        ], 201);
    }

    #[Route('/api/foro/{id}', name: 'update_foro', methods: ['PUT'])]
    public function updateForo(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $foro = $this->foroRepository->find($id);

        if (!$foro) {
            throw new NotFoundHttpException('Foro no encontrado');
        }

        $foro->setTitulo($data['titulo']);
        $foro->setDescripcion($data['descripcion']);
        $foro->setFechaCreacion(new \DateTimeImmutable($data['fecha_creacion']));

        $admin = $this->entityManager->getRepository(Usuario::class)->find($data['admin_id']);
        if ($admin) {
            $foro->setAdmin($admin);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $foro->getId(),
            'titulo' => $foro->getTitulo(),
            'descripcion' => $foro->getDescripcion(),
            'fechaCreacion' => $foro->getFechaCreacion()->format('Y-m-d H:i:s'),
            'admin' => $foro->getAdmin() ? $foro->getAdmin()->getId() : null,
        ]);
    }

    #[Route('/api/foro/{id}', name: 'delete_foro', methods: ['DELETE'])]
    public function deleteForo(int $id): JsonResponse
    {
        $foro = $this->foroRepository->find($id);

        if (!$foro) {
            throw new NotFoundHttpException('Foro no encontrado');
        }

        $this->entityManager->remove($foro);
        $this->entityManager->flush();

        return $this->json(['message' => 'Foro eliminado con éxito']);
    }
}
