DELETE FROM todos;

INSERT INTO todos (id, title, completed, version, created_at, updated_at) VALUES
  ('01954a8f-65e3-7b14-9e0c-8d4f6f15f101', 'Sprint backlog refinement for checkout bugs', 0, 1, '2026-02-28T09:00:00.000Z', '2026-02-28T09:00:00.000Z'),
  ('01954a8f-65e3-7b14-9e0c-8d4f6f15f102', 'Prepare onboarding checklist for new designer', 0, 1, '2026-02-28T09:15:00.000Z', '2026-02-28T09:15:00.000Z'),
  ('01954a8f-65e3-7b14-9e0c-8d4f6f15f103', 'Review Q2 cost forecast with finance', 1, 2, '2026-02-27T16:30:00.000Z', '2026-02-28T08:45:00.000Z'),
  ('01954a8f-65e3-7b14-9e0c-8d4f6f15f104', 'Draft incident follow-up for API timeout spike', 0, 1, '2026-02-28T07:50:00.000Z', '2026-02-28T07:50:00.000Z');
