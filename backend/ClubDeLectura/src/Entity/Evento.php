<?php

namespace App\Entity;

use App\Repository\EventoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventoRepository::class)]
class Evento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titulo = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $descripcion = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $fecha = null;

    #[ORM\Column(length: 255)]
    private ?string $ubicacion = null;

    #[ORM\ManyToOne(inversedBy: 'eventos')]
    private ?Usuario $organizador = null;

    /**
     * @var Collection<int, Inscripcion>
     */
    #[ORM\OneToMany(targetEntity: Inscripcion::class, mappedBy: 'evento')]
    private Collection $inscripcions;

    public function __construct()
    {
        $this->inscripcions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): static
    {
        $this->titulo = $titulo;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getFecha(): ?\DateTimeInterface
    {
        return $this->fecha;
    }

    public function setFecha(\DateTimeInterface $fecha): static
    {
        $this->fecha = $fecha;

        return $this;
    }

    public function getUbicacion(): ?string
    {
        return $this->ubicacion;
    }

    public function setUbicacion(string $ubicacion): static
    {
        $this->ubicacion = $ubicacion;

        return $this;
    }

    public function getOrganizador(): ?Usuario
    {
        return $this->organizador;
    }

    public function setOrganizador(?Usuario $organizador): static
    {
        $this->organizador = $organizador;

        return $this;
    }

    /**
     * @return Collection<int, Inscripcion>
     */
    public function getInscripcions(): Collection
    {
        return $this->inscripcions;
    }

    public function addInscripcion(Inscripcion $inscripcion): static
    {
        if (!$this->inscripcions->contains($inscripcion)) {
            $this->inscripcions->add($inscripcion);
            $inscripcion->setEvento($this);
        }

        return $this;
    }

    public function removeInscripcion(Inscripcion $inscripcion): static
    {
        if ($this->inscripcions->removeElement($inscripcion)) {
            // set the owning side to null (unless already changed)
            if ($inscripcion->getEvento() === $this) {
                $inscripcion->setEvento(null);
            }
        }

        return $this;
    }
}
