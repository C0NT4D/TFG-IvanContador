<?php

namespace App\Entity;

use App\Repository\UsuarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioRepository::class)]
class Usuario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nombre = null;

    #[ORM\Column(length: 100)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $contrasena = null;

    #[ORM\Column(length: 255)]
    private ?string $rol = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $fechaRegistro = null;

    /**
     * @var Collection<int, Lectura>
     */
    #[ORM\OneToMany(targetEntity: Lectura::class, mappedBy: 'usuario')]
    private Collection $lecturas;

    /**
     * @var Collection<int, Foro>
     */
    #[ORM\OneToMany(targetEntity: Foro::class, mappedBy: 'admin')]
    private Collection $foros;

    /**
     * @var Collection<int, Mensaje>
     */
    #[ORM\OneToMany(targetEntity: Mensaje::class, mappedBy: 'usuario')]
    private Collection $mensajes;

    /**
     * @var Collection<int, Evento>
     */
    #[ORM\OneToMany(targetEntity: Evento::class, mappedBy: 'organizador')]
    private Collection $eventos;

    /**
     * @var Collection<int, Inscripcion>
     */
    #[ORM\OneToMany(targetEntity: Inscripcion::class, mappedBy: 'usuario')]
    private Collection $inscripcions;

    /**
     * @var Collection<int, Recomendacion>
     */
    #[ORM\OneToMany(targetEntity: Recomendacion::class, mappedBy: 'usuario')]
    private Collection $recomendacions;

    public function __construct()
    {
        $this->lecturas = new ArrayCollection();
        $this->foros = new ArrayCollection();
        $this->mensajes = new ArrayCollection();
        $this->eventos = new ArrayCollection();
        $this->inscripcions = new ArrayCollection();
        $this->recomendacions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getContrasena(): ?string
    {
        return $this->contrasena;
    }

    public function setContrasena(string $contrasena): static
    {
        $this->contrasena = $contrasena;

        return $this;
    }

    public function getRol(): ?string
    {
        return $this->rol;
    }

    public function setRol(string $rol): static
    {
        $this->rol = $rol;

        return $this;
    }

    public function getFechaRegistro(): ?\DateTimeImmutable
    {
        return $this->fechaRegistro;
    }

    public function setFechaRegistro(\DateTimeImmutable $fechaRegistro): static
    {
        $this->fechaRegistro = $fechaRegistro;

        return $this;
    }

    /**
     * @return Collection<int, Lectura>
     */
    public function getLecturas(): Collection
    {
        return $this->lecturas;
    }

    public function addLectura(Lectura $lectura): static
    {
        if (!$this->lecturas->contains($lectura)) {
            $this->lecturas->add($lectura);
            $lectura->setUsuario($this);
        }

        return $this;
    }

    public function removeLectura(Lectura $lectura): static
    {
        if ($this->lecturas->removeElement($lectura)) {
            if ($lectura->getUsuario() === $this) {
                $lectura->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Foro>
     */
    public function getForos(): Collection
    {
        return $this->foros;
    }

    public function addForo(Foro $foro): static
    {
        if (!$this->foros->contains($foro)) {
            $this->foros->add($foro);
            $foro->setAdmin($this);
        }

        return $this;
    }

    public function removeForo(Foro $foro): static
    {
        if ($this->foros->removeElement($foro)) {
            if ($foro->getAdmin() === $this) {
                $foro->setAdmin(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Mensaje>
     */
    public function getMensajes(): Collection
    {
        return $this->mensajes;
    }

    public function addMensaje(Mensaje $mensaje): static
    {
        if (!$this->mensajes->contains($mensaje)) {
            $this->mensajes->add($mensaje);
            $mensaje->setUsuario($this);
        }

        return $this;
    }

    public function removeMensaje(Mensaje $mensaje): static
    {
        if ($this->mensajes->removeElement($mensaje)) {
            if ($mensaje->getUsuario() === $this) {
                $mensaje->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Evento>
     */
    public function getEventos(): Collection
    {
        return $this->eventos;
    }

    public function addEvento(Evento $evento): static
    {
        if (!$this->eventos->contains($evento)) {
            $this->eventos->add($evento);
            $evento->setOrganizador($this);
        }

        return $this;
    }

    public function removeEvento(Evento $evento): static
    {
        if ($this->eventos->removeElement($evento)) {
            if ($evento->getOrganizador() === $this) {
                $evento->setOrganizador(null);
            }
        }

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
            $inscripcion->setUsuario($this);
        }

        return $this;
    }

    public function removeInscripcion(Inscripcion $inscripcion): static
    {
        if ($this->inscripcions->removeElement($inscripcion)) {
            if ($inscripcion->getUsuario() === $this) {
                $inscripcion->setUsuario(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Recomendacion>
     */
    public function getRecomendacions(): Collection
    {
        return $this->recomendacions;
    }

    public function addRecomendacion(Recomendacion $recomendacion): static
    {
        if (!$this->recomendacions->contains($recomendacion)) {
            $this->recomendacions->add($recomendacion);
            $recomendacion->setUsuario($this);
        }

        return $this;
    }

    public function removeRecomendacion(Recomendacion $recomendacion): static
    {
        if ($this->recomendacions->removeElement($recomendacion)) {
            if ($recomendacion->getUsuario() === $this) {
                $recomendacion->setUsuario(null);
            }
        }

        return $this;
    }
}
