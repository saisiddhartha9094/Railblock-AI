import xml.etree.ElementTree as ET
from typing import Dict, Any, List
from app.models.schemas import OptimizationResponse, Department


class CRISCOAExporter:
    """Exports approved railway maintenance block schedules in official CRIS Control Office Application

    (COA) XML & JSON schema for direct ingestion by Divisional Railway Control Offices.
    """

    @staticmethod
    def export_to_cris_coa_xml(opt_res: OptimizationResponse) -> str:
        """Generates standard CRIS COA Block Transfer XML format."""
        root = ET.Element("CRIS_COA_BLOCK_TRANSMISSION", {
            "version": "4.2",
            "division": "PRYJ",
            "zone": "NCR",
            "generated_by": "RailBlock_AI_Core"
        })

        meta = ET.SubElement(root, "TRANSMISSION_METADATA")
        ET.SubElement(meta, "TOTAL_BLOCKS").text = str(opt_res.total_blocks_scheduled)
        ET.SubElement(meta, "CLUBBING_EFFICIENCY").text = f"{opt_res.clubbing_efficiency_pct}%"
        ET.SubElement(meta, "AAI_AFTER").text = f"{opt_res.asset_availability_index_after}%"
        ET.SubElement(meta, "DELAYS_SAVED_MIN").text = str(opt_res.delay_minutes_saved)

        blocks_node = ET.SubElement(root, "SCHEDULED_POSSESSIONS")
        for b in opt_res.scheduled_blocks:
            b_node = ET.SubElement(blocks_node, "BLOCK_ENTRY", {"id": b.demand_id})
            ET.SubElement(b_node, "DEPARTMENT").text = b.department.value
            ET.SubElement(b_node, "SECTION_ID").text = b.section_id
            ET.SubElement(b_node, "LINE_ID").text = b.line_id.value
            ET.SubElement(b_node, "START_TIME_MIN").text = str(b.scheduled_start_min)
            ET.SubElement(b_node, "END_TIME_MIN").text = str(b.scheduled_end_min)
            ET.SubElement(b_node, "DURATION_MIN").text = str(b.duration_min)
            ET.SubElement(b_node, "IS_POWER_BLOCK").text = str(b.department == Department.ELECTRICAL_OHE).lower()
            ET.SubElement(b_node, "IS_CLUBBED").text = str(b.is_clubbed).lower()
            ET.SubElement(b_node, "SAFETY_JUSTIFICATION").text = b.justification or "RDSO Certified Shadow Block"

        return ET.tostring(root, encoding="utf-8").decode("utf-8")

    @staticmethod
    def export_to_cris_coa_json(opt_res: OptimizationResponse) -> Dict[str, Any]:
        """Generates standard CRIS COA REST Payload format."""
        return {
            "cris_coa_transmission": {
                "schema_version": "4.2",
                "source_system": "RailBlock-AI CP-SAT Optimization Core",
                "division": "Prayagraj Division (PRYJ)",
                "zonal_railway": "North Central Railway (NCR)",
                "optimization_summary": {
                    "total_blocks": opt_res.total_blocks_scheduled,
                    "joint_clubbed_blocks": opt_res.clubbed_blocks_count,
                    "clubbing_efficiency_pct": opt_res.clubbing_efficiency_pct,
                    "asset_availability_index_achieved": opt_res.asset_availability_index_after,
                    "delay_minutes_recovered": opt_res.delay_minutes_saved
                },
                "possessions": [
                    {
                        "possession_id": b.demand_id,
                        "department": b.department.value,
                        "section_id": b.section_id,
                        "track_line": b.line_id.value,
                        "time_window": {
                            "start_minute_of_day": b.scheduled_start_min,
                            "end_minute_of_day": b.scheduled_end_min,
                            "duration_minutes": b.duration_min
                        },
                        "is_25kv_power_block": (b.department == Department.ELECTRICAL_OHE),
                        "is_joint_shadow_clubbed": b.is_clubbed,
                        "clubbed_with_demands": b.clubbed_with_ids,
                        "statutory_safety_justification": b.justification or "RDSO Certified Shadow Block"
                    }
                    for b in opt_res.scheduled_blocks
                ]
            }
        }


cris_exporter = CRISCOAExporter()
