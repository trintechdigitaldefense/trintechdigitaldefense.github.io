#!/usr/bin/env python3
import uvicorn
uvicorn.run("server:app", host="0.0.0.0", port=8081, log_level="warning")
