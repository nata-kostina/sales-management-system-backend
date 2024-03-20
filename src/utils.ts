interface WithPriority {
    priority: number;
}
export const sortByPriority = (a: WithPriority, b: WithPriority, type: "asc" | "desc" = "asc"): number => {
    return type === "asc" ? a.priority - b.priority : b.priority - a.priority;
};
