USE adaev;

ALTER TABLE event_summaries
  ADD COLUMN seminar_participants INT UNSIGNED  NOT NULL DEFAULT 0 AFTER custody_revenue,
  ADD COLUMN seminar_revenue      DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER seminar_participants;