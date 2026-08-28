# RailBlock-AI: AI-Powered Automatic Block Planning & Asset Availability Maximizer for Indian Railways
**PS Code:** SIH26027 | **Ministry:** Ministry of Railways | **Theme:** Smart Automation | **Track:** Software

An enterprise-grade, constraint-optimization decision support platform designed for Indian Railways Divisional Control Offices (e.g., Prayagraj Division - NCR) to automatically sequence, optimize, and club cross-departmental maintenance blocks (Civil Engineering, S&T, Electrical OHE, Traffic/Operating), maximize asset availability (track capacity, rolling stock, locomotives), and minimize train punctuality loss.

---

## 🚂 Key Features & Capabilities

1. **Google OR-Tools CP-SAT Mathematical Scheduler**:
   - Models hard safety constraints: non-overlapping track possessions, statutory RDSO maintenance cycles (IRPWM Para 1102 / ACTM Vol II / SEM Part I), 25kV power cut safety, and train headway.
   - Solves multi-objective optimization: minimizes train delay cost, eliminates duplicate block fragmentation, and aligns cross-departmental tasks into unified joint shadow windows.

2. **ML Disruption & Precedence Predictor**:
   - Continuous disruption scoring model assessing train traffic density, section gradients, downstream bottleneck vulnerability, and delay cascades.
   - Recommends top alternative "Green Windows" across the 24-hour horizon.

3. **SimPy Discrete-Event What-If Simulation Sandbox**:
   - Interactive scenario builder allowing railway officials to test hypothetical maintenance blocks (custom start time, duration, line, department) and observe real-time train regulation, loop line holding, and $\Delta \text{AAI}$ impact.

4. **Asset Availability Index (AAI) KPI Cockpit**:
   - Single authoritative KPI quantifying overall asset readiness ($\text{AAI} = 88.5\%$, $+28.5\%$ gain over manual baseline).
   - Real-time sub-indices: Track Line Availability ($90.9\%$), Locomotive Turnaround Rate ($86.7\%$), Freight Rake Utilization ($85.0\%$).

5. **Multi-Department Joint Demand & Digital Concurrence Portal**:
   - Inter-departmental submission workflow with automated RDSO rule verification.
   - Digital sign-off stamps for SSE/P-Way, SSE/TRD, SSE/Signal, and Chief Controller.

6. **Emergency Unscheduled Block Injector & Dynamic Rescheduler**:
   - Simulates real-time rail fractures or OHE breakdowns; instantly applies interlocking block protection, dispatches caution orders, and executes real-time dynamic re-optimization of downstream trains.

7. **Explainable AI & Official Shift Handover Reports**:
   - Plain-language decision justifications for every slot decision.
   - Exportable, printable shift handover certificates and immutable CRIS TMS audit trails.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies Used |
|---|---|
| **Constraint Optimizer** | Google OR-Tools CP-SAT (Integer Linear Constraint Programming) |
| **ML & Simulation** | Scikit-Learn (Random Forest Regressor), SimPy (Discrete-Event Simulation), NumPy, Pandas |
| **Backend API** | Python 3.11, FastAPI, Uvicorn, Pydantic v2 |
| **Frontend Dashboard** | React 18, Vite 5, Tailwind CSS, Lucide React, Axios |
| **Corridor Dataset** | Prayagraj (PRYJ) - Pt. Deen Dayal Upadhyaya Jn (DDU) High Density Golden Quadrilateral Corridor (153.2 km) |

---

## 🚀 How to Run

### Backend
```powershell
cd backend
# Using the installed virtualenv:
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- API Documentation & Swagger UI: `http://127.0.0.1:8000/docs`

### Frontend
```powershell
cd frontend
npm run dev
```
- Web Application: `http://127.0.0.1:5173/`

### Automated Test Suite
```powershell
cd backend
.\.venv\Scripts\python.exe test_backend.py
```
