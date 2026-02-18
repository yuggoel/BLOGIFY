from supabase import create_client, Client
from .config import settings

# Uses the SERVICE ROLE key — bypasses RLS so FastAPI enforces auth instead.
# Never expose this key to the frontend.
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)
