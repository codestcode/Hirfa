import os
import glob
import re

routes = [
    "app/client/rate-review/[bookingId]",
    "app/client/addresses/edit/[id]",
    "app/client/order/cancel/[id]",
    "app/client/craftsman/[id]",
    "app/client/services/[categoryId]",
    "app/client/booking/[workerId]",
    "app/client/chat/[id]",
    "app/client/wallet/edit-card/[id]",
    "app/(main)/worker/booking/[id]",
    "app/(main)/worker/messages/[id]",
    "app/(onboarding)/intro/[step]"
]

for route in routes:
    old_page = os.path.join(route, "page.tsx")
    client_page = os.path.join(route, "ClientPage.tsx")
    
    # Rename page.tsx to ClientPage.tsx if it's the original one (i.e. has 'use client' at the top)
    if os.path.exists(old_page):
        with open(old_page, 'r') as f:
            content = f.read()
            
        if 'use client' in content:
            os.rename(old_page, client_page)
            print(f"Renamed {old_page} to {client_page}")
            
            # extract parameter name
            match = re.search(r'\[([^\]]+)\]$', route)
            param_name = match.group(1) if match else "id"
            
            if route == "app/(onboarding)/intro/[step]":
                new_page_content = f"""import ClientPage from './ClientPage';

export function generateStaticParams() {{
  return [
    {{ step: '1' }},
    {{ step: '2' }},
    {{ step: '3' }},
    {{ step: '4' }}
  ];
}}

export default function Page({{ params }}: {{ params: any }}) {{
  return <ClientPage params={{params}} />;
}}
"""
            else:
                new_page_content = f"""import ClientPage from './ClientPage';

export function generateStaticParams() {{
  return [{{ {param_name}: 'dummy' }}];
}}

export default function Page({{ params }}: {{ params: any }}) {{
  return <ClientPage params={{params}} />;
}}
"""
            with open(old_page, 'w') as f:
                f.write(new_page_content)
            print(f"Created new {old_page}")
        else:
            print(f"{old_page} is already a Server Component")
