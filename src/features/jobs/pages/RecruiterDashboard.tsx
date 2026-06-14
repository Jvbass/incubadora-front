import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Briefcase, Plus, X } from "lucide-react";
import {
  fetchMyJobOffers,
  createJobOffer,
  updateJobOffer,
  publishJobOffer,
  closeJobOffer,
} from "../../../api/jobsApi";
import { JobOfferCard } from "../components/JobOfferCard";
import JobOfferForm from "../components/JobOfferForm";
import type { CreateJobOfferRequest, JobOffer } from "../../../types";

const RecruiterDashboard = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<JobOffer | null>(null);

  const { data: offers, isLoading } = useQuery<JobOffer[]>({
    queryKey: ["myJobOffers"],
    queryFn: fetchMyJobOffers,
    staleTime: 1000 * 60,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["myJobOffers"] });

  const createMutation = useMutation({
    mutationFn: createJobOffer,
    onSuccess: () => {
      toast.success("Oferta creada en borrador.");
      invalidate();
      setShowForm(false);
    },
    onError: () => toast.error("No se pudo crear la oferta."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateJobOfferRequest }) =>
      updateJobOffer(id, data),
    onSuccess: () => {
      toast.success("Oferta actualizada.");
      invalidate();
      setEditingOffer(null);
    },
    onError: () => toast.error("No se pudo actualizar la oferta."),
  });

  const publishMutation = useMutation({
    mutationFn: publishJobOffer,
    onSuccess: () => {
      toast.success("Oferta publicada.");
      invalidate();
    },
    onError: () => toast.error("No se pudo publicar la oferta."),
  });

  const closeMutation = useMutation({
    mutationFn: closeJobOffer,
    onSuccess: () => {
      toast.success("Oferta cerrada.");
      invalidate();
    },
    onError: () => toast.error("No se pudo cerrar la oferta."),
  });

  const handleCreate = (data: CreateJobOfferRequest) =>
    createMutation.mutate(data);

  const handleUpdate = (data: CreateJobOfferRequest) => {
    if (editingOffer) updateMutation.mutate({ id: editingOffer.id, data });
  };

  const isBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    publishMutation.isPending ||
    closeMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-text-light flex items-center gap-2">
          <Briefcase size={22} /> Mis ofertas de empleo
        </h1>
        {!showForm && !editingOffer && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus size={16} /> Nueva oferta
          </button>
        )}
      </div>

      {(showForm || editingOffer) && (
        <div className="p-4 bg-white dark:bg-bg-dark rounded-lg border border-gray-300 dark:border-gray-700 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold dark:text-text-light">
              {editingOffer ? "Editar oferta" : "Nueva oferta"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingOffer(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
          <JobOfferForm
            initialData={editingOffer}
            onSubmit={editingOffer ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingOffer(null);
            }}
            isSubmitting={isBusy}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando ofertas...</p>
      ) : !offers || offers.length === 0 ? (
        <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-300">
          No tienes ofertas publicadas aún. Crea tu primera oferta.
        </p>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <JobOfferCard
              key={offer.id}
              offer={offer}
              onEdit={(o) => {
                setEditingOffer(o);
                setShowForm(false);
              }}
              onPublish={(id) => publishMutation.mutate(id)}
              onClose={(id) => closeMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
