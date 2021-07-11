import React, { useState } from 'react';
import { useSelectedProjectValue } from './selectedProject.js';
const SideBar = () => {
    const { setSelectedProject } = useSelectedProjectValue();
    const [active, setActive] = useState('toDoList');
    const [showProjects, setShowProjects] = useState(true);

    return (
    <div className="sidebar" data-testid="sidebar">
      <ul className="sidebar__generic">
        <li
          data-testid="toDoList"
          className={active === 'toDoList' ? 'active' : undefined}
        >
          <div
            data-testid="toDoList-action"
            aria-label="Show tasks"
            tabIndex={0}
            role="button"
            onClick={() => {
              setActive('inbox');
              setSelectedProject('TODOLIST');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActive('toDoList');
                setSelectedProject('TODOLIST');
              }
            }}
          >
            <span>
                <i class="fas fa-tasks"></i>
            </span>
            <span>To Do List</span>
          </div>
        </li>
        <li
          data-testid="timetable"
          className={active === 'timetable' ? 'active' : undefined}
        >
          <div
            data-testid="timetable-action"
            aria-label="Show today's tasks"
            tabIndex={0}
            role="button"
            onClick={() => {
              setActive('timetable');
              setSelectedProject('TIMETABLE');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActive('timetable');
                setSelectedProject('TIMETABLE');
              }
            }}
          >
            <span>
                <i class="fas fa-calendar-alt"></i>
            </span>
            <span>Timetable</span>
          </div>
        </li>
        <li
          data-testid="next_7"
          className={active === 'next_7' ? 'active' : undefined}
        >
          <div
            data-testid="next_7-action"
            aria-label="Show tasks for the next 7 days"
            tabIndex={0}
            role="button"
            onClick={() => {
              setActive('next_7');
              setSelectedProject('NEXT_7');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActive('next_7');
                setSelectedProject('NEXT_7');
              }
            }}
          >
            <span>
                <i class="fas fa-calendar-alt"></i>
            </span>
            <span>Timetable</span>
          </div>
        </li>
      </ul>

      <ul className="sidebar__projects">{showProjects}</ul>

      {showProjects}
    </div>
  );
};

export {SideBar};