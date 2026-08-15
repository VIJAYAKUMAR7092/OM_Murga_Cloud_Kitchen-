"use client";

import { useState } from "react";
import { FoodFilters } from "./FoodFilters";
import { FoodTable } from "./FoodTable";
import { FoodModal } from "./FoodModal";
import { DeleteFoodDialog } from "./DeleteFoodDialog";
import { Food } from "@prisma/client";

interface FoodManagerProps {
  initialFoods: Food[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export function FoodManager({ initialFoods, totalItems, totalPages, currentPage }: FoodManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);

  const handleAdd = () => {
    setEditingFood(null);
    setIsModalOpen(true);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (food: Food) => {
    setFoodToDelete(food);
    setIsDeleteDialogOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingFood(null), 300); // Wait for exit animation
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTimeout(() => setFoodToDelete(null), 300);
  };

  return (
    <div className="space-y-6">
      <FoodFilters onAdd={handleAdd} />
      
      <div className="bg-[#111] rounded-2xl border border-white/10 shadow-lg overflow-hidden">
        <FoodTable 
          foods={initialFoods}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          totalPages={totalPages}
          currentPage={currentPage}
          totalItems={totalItems}
        />
      </div>

      <FoodModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        food={editingFood} 
      />

      <DeleteFoodDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        food={foodToDelete}
      />
    </div>
  );
}
