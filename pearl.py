from google.protobuf.descriptor_pb2 import FileDescriptorProto
from aea.mail.base_pb2 import DESCRIPTOR
from multiaddr.codecs.idna import to_bytes as _
from multiaddr.codecs.uint16be import to_bytes as _
from operate.cli import main

if __name__ == "__main__":
    main()
