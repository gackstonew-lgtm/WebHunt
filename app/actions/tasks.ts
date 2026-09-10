"use server";

import prisma from "@/lib/db";
import { FollowUpTask } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/auth/session";

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // In CLI test runners outside request context, static generation store is not active
  }
}

export interface TaskItem {
  id: string;
  leadId?: string | null;
  userId?: string | null;
  taskType: string;
  title: string;
  notes?: string | null;
  dueAt: string | Date;
  completedAt?: string | Date | null;
  isCompleted: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  leadName?: string;
}

export async function createFollowUpTaskAction(params: {
  leadId?: string;
  userId?: string;
  taskType: string;
  title: string;
  notes?: string;
  dueAt: Date | string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}): Promise<{ success: boolean; data?: FollowUpTask; error?: string }> {
  try {
    const session = await getCurrentSession();
    const targetUserId = params.userId || session?.userId;

    const task = await prisma.followUpTask.create({
      data: {
        leadId: params.leadId || null,
        userId: targetUserId || null,
        taskType: params.taskType,
        title: params.title,
        notes: params.notes || null,
        dueAt: new Date(params.dueAt),
        priority: params.priority || "MEDIUM",
        isCompleted: false,
      },
    });

    safeRevalidatePath("/pipeline");
    return { success: true, data: task };
  } catch (error: any) {
    console.error("[TasksAction] Create task failed:", error);
    return { success: false, error: error.message || "Failed to create follow-up task" };
  }
}

export async function fetchUpcomingTasksAction(userId?: string): Promise<{
  success: boolean;
  data: TaskItem[];
  error?: string;
}> {
  try {
    const session = await getCurrentSession();
    const targetUserId = userId || session?.userId;

    const records = await prisma.followUpTask.findMany({
      where: {
        ...(targetUserId ? { userId: targetUserId } : {}),
        isCompleted: false,
      },
      include: {
        lead: {
          select: {
            businessName: true,
          },
        },
      },
      orderBy: { dueAt: "asc" },
      take: 20,
    });

    const tasks: TaskItem[] = records.map((r) => ({
      id: r.id,
      leadId: r.leadId,
      userId: r.userId,
      taskType: r.taskType,
      title: r.title,
      notes: r.notes,
      dueAt: r.dueAt,
      completedAt: r.completedAt,
      isCompleted: r.isCompleted,
      priority: (r.priority as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
      leadName: r.lead?.businessName,
    }));

    return { success: true, data: tasks };
  } catch (error: any) {
    console.error("[TasksAction] Fetch tasks failed:", error);
    return { success: false, data: [], error: error.message };
  }
}

export async function toggleTaskCompletedAction(
  taskId: string,
  isCompleted: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.followUpTask.update({
      where: { id: taskId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    safeRevalidatePath("/pipeline");
    return { success: true };
  } catch (error: any) {
    console.error("[TasksAction] Toggle task failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTaskAction(taskId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.followUpTask.delete({
      where: { id: taskId },
    });

    safeRevalidatePath("/pipeline");
    return { success: true };
  } catch (error: any) {
    console.error("[TasksAction] Delete task failed:", error);
    return { success: false, error: error.message };
  }
}
