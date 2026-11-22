from pydantic import BaseModel

class StartParseRequest(BaseModel):
    session_id: str
    filename: str
    lang_list: list[str] | None = None
    detect_table_structure: bool = True
    detect_formula: bool = True
    
    
class EditJsonRequest(BaseModel):
    session_id: str
    new_data: list[dict]