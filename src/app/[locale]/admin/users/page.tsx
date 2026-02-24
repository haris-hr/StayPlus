"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Shield } from "lucide-react";
import { Button, Card, Badge, Spinner, Avatar, Modal, Input, Select } from "@/components/ui";
import type { User as UserType, UserRole } from "@/types";

// Mock data
const initialUsers: (UserType & { tenantName?: string })[] = [
  {
    id: "1",
    email: "admin@stayplus.com",
    displayName: "Admin User",
    role: "super_admin",
    active: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "host@example.com",
    displayName: "Sunny Sarajevo",
    role: "tenant_admin",
    tenantId: "demo",
    tenantName: "Sunny Sarajevo Apartment",
    active: true,
    createdAt: new Date("2024-02-15"),
  },
];

const roleConfig: Record<UserRole, { label: string; variant: "primary" | "success" | "default" }> = {
  super_admin: { label: "Super Admin", variant: "primary" },
  tenant_admin: { label: "Tenant Admin", variant: "success" },
  tenant_viewer: { label: "Viewer", variant: "default" },
};

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "tenant_admin", label: "Tenant Admin" },
  { value: "tenant_viewer", label: "Viewer" },
];

const tenantOptions = [
  { value: "", label: "No tenant (Super Admin)" },
  { value: "demo", label: "Sunny Sarajevo Apartment" },
];

export default function UsersPage() {
  const t = useTranslations("admin");
  const [users, setUsers] = useState<(UserType & { tenantName?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<(UserType & { tenantName?: string }) | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    role: "tenant_viewer" as UserRole,
    tenantId: "",
    active: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setUsers(initialUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  const resetForm = () => {
    setFormData({
      email: "",
      displayName: "",
      role: "tenant_viewer",
      tenantId: "",
      active: true,
    });
    setEditingUser(null);
  };

  const handleEdit = (user: UserType & { tenantName?: string }) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      displayName: user.displayName || "",
      role: user.role,
      tenantId: user.tenantId || "",
      active: user.active,
    });
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleSubmit = () => {
    if (!formData.email) {
      alert("Email is required");
      return;
    }

    const tenantName = tenantOptions.find((t) => t.value === formData.tenantId)?.label;

    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                email: formData.email,
                displayName: formData.displayName || undefined,
                role: formData.role,
                tenantId: formData.tenantId || undefined,
                tenantName: formData.tenantId ? tenantName : undefined,
                active: formData.active,
              }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: UserType & { tenantName?: string } = {
        id: `user-${Date.now()}`,
        email: formData.email,
        displayName: formData.displayName || undefined,
        role: formData.role,
        tenantId: formData.tenantId || undefined,
        tenantName: formData.tenantId ? tenantName : undefined,
        active: formData.active,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
    }

    setShowForm(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("users")}</h1>
          <p className="text-foreground/60 mt-1 text-sm sm:text-base">
            Manage admin users and their permissions
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add User</span>
        </Button>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-foreground/60">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-foreground/60">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.photoURL}
                          fallback={user.displayName || user.email}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {user.displayName || "No name"}
                          </p>
                          <p className="text-xs text-foreground/60">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={roleConfig[user.role].variant}>
                        <Shield className="w-3 h-3 mr-1" />
                        {roleConfig[user.role].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-foreground/80 text-sm">
                        {user.tenantName || "—"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.active ? "success" : "danger"}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">No users found</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* User Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        title={editingUser ? "Edit User" : "Add User"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
            required
          />

          <Input
            label="Display Name"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="John Doe"
          />

          <Select
            label="Role"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
          />

          <Select
            label="Tenant (for Tenant Admin/Viewer)"
            options={tenantOptions}
            value={formData.tenantId}
            onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
            hint="Leave empty for Super Admin"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-foreground">Active</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
