from watchdog.observers import Observer

observer_dict = dict()


def start(path, event_handler):
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    observer_dict[path] = observer


def stop(path):
    if path in observer_dict:
        observer_dict[path].stop()
        del observer_dict[path]


def get_observer(path):
    return observer_dict[path]


def is_alive(path):
    return path in observer_dict


def is_being_watched(file_path, path=None):
    if path:
        if path in observer_dict:
            return file_path.startswith(path)
    else:
        for key in observer_dict:
            if file_path.startswith(key):
                return True
        return False


def get_observer_path(file_path):
    for key in observer_dict:
        if file_path.startswith(key):
            return key
    return None
