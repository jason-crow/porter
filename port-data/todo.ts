import { ClipVector } from "@bentley/geometry-core/lib/numerics/ClipVector";
import { ClipPlane } from "@bentley/geometry-core/lib/numerics/ClipPlanes";
import { Matrix4d } from "@bentley/geometry-core/lib/numerics/Geometry4d";
import { Transform, Point3d, Point2d, RotMatrix, Vector3d } from "@bentley/geometry-core/lib/PointVector";
import { BentleyStatus } from "@bentley/bentleyjs-core/lib/Bentley";
import { BeTimePoint } from "@bentley/bentleyjs-core/lib/Time";

import { assert } from "chai";

import { ColorDef } from "../../common/ColorDef";
import { Decorations, DecorationList, GraphicList, ViewFlags, LinePixels, Graphic } from "../../common/Render";

import { BranchState, BranchStack } from "./BranchState";
import { LineCode, EdgeOverrides } from "./EdgeOverrides";
import { LUTDimension, LUTParams, FeatureDimension, FeatureIndexType, FeatureDimensions, FeatureDimensionsIterator } from "./FeatureDimensions";
import { FloatRgb, FloatRgba, FloatPreMulRgba } from "./FloatRGBA";
import { GL } from "./GL";
import { RenderPass, GeometryType, TextureUnit, RenderOrder, isPlanar, isSurface, CompositeFlags, SurfaceFlags, OvrFlags, IsTranslucent } from "./RenderFlags";
import { RenderStateFlags, RenderStateBlend, RenderState } from "./RenderState";
import { Mode, WithClipVolume, TechniqueFlags } from "./TechniqueFlags";
import { BuiltInTechniqueId, TechniqueId } from "./TechniqueId";
import { Handle, BufferHandle } from "./Handle";

export namespace GLES {}
  // CACHED GEOMETRY
  export class MaterialData {
    a: FloatRgb; 
    b: FloatPreMulRgba;
    c: Material;
  }
  export class NonUniformColor {
    a: LUTParams;
    b: BufferHandle;
    c: ColorTable;
    d: GLESTexture;
  }
  export class ColorData {
    a: NonUniformColor;
    b: LUTDimension;
    c: FloatPreMulRgba;
  }
  export class FeatureIndices {
    a: BufferHandle;
    b: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class FeatureDimensions {
    a: FeatureIndex.Type; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class LitMeshData {
    a: BufferHandle;
    b: MaterialData;
  }
  export class TexturedMeshData {
    a: QBufferHandle2d; // ./Handle.ts
    c: GLES.Texture;
  }
  export class CachedGeometry {
    a: QBufferHandle3d; // ./Handle.ts
    b: QPoint3d; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    c: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    d: ViewportQuad;
    e: BentleyStatus; // was StatusInt;
    f: BufferHandle;
    g: GLenum;
    h: GLsizei;
    i: number | ArrayBuffer | ArrayBufferView | undefined; // was GLvoid
    j: Target;
    k: LineCode;
    l: TechniqueId;
    m: RenderPass;
    n: RenderOrder;
    o: MeshGeometry;
    q: IndexedGeometry;
    r: TexturedMeshData;
    s: LitMeshData;
    t: ColorData;
    u: MaterialData;
    v: PolylineGeometry;
    w: EdgeGeometry;
    x: SilhouetteEdgeGeometry;
    y: PointStringGeometry;
    z: PointCloudGeometry;
    aa: ViewportQuadGeometry;
    ab: TexturedViewportQuadGeometry;
    ac: CompositeGeometry;
    ad: FeatureIndices;
    ae: ShaderProgramParams;
  }

  export class CachedGeometryCreateParams {
    a: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }

  export class IndexedGeometry extends CachedGeometry {
    ba: BufferHandle;
    bb: GLsizei;
  } 

  export class IndexedGeometryCreateParams extends CachedGeometryCreateParams {
    ba: UInt32List; // ./GLESCommon.h
    bb: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }

  export class MeshGeometry extends IndexedGeometry {
    ca: FloatPreMulRgba;
    cb: FeatureIndices;
    cc: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cd: RenderPass;
    ce: ColorData;
    cf: MaterialData;
    cg: GLES.Texture;
    ch: NonUniformColor;
    ci: SurfaceFlags;
    cj: FeatureIndex.Type; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }

  export class MeshGeometryCreateParams extends IndexedGeometryCreateParams {
    ca: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cb: ColorDef;
    cc: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cd: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }

  export class TexturedMeshGeometry extends MeshGeometry {
    da: QBufferHandle2d; // ./Handle.ts
    db: RefCounted; // ?
    dc: GLES.Texture;
    dd: SurfaceFlags;
    de: TexturedMeshData;
  }

  export class TexturedMeshGeometryCreateParams extends MeshGeometryCreateParams {
    da: QPoint2dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    db: GLES.Texture;
  }
  export class LitMeshGeometry extends MeshGeometry {
    da: BufferHandle;
    db: NonUniformColor;
    dc: LitMeshData;
  }
  export class LitMeshGeometryCreateParams extends MeshGeometryCreateParams {
    da: OctEncodedNormalList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    db: Material;
    dc: ColorTable;
  }
  export class UnlitMeshGeometry extends MeshGeometry {
    da: NonUniformColor;
  }
  export class UnlitMeshGeoemtryCreateParams extends MeshGeometryCreateParams {
    da: ColorTable;
  }
  export class TexturedLitMeshGeometry extends MeshGeometry {
    da: BufferHandle;
    db: BufferHandle2d; // ./Handle.ts
    dc: RefCounted;
    df: LitMeshData;
    dg: TexturedMeshData;
  }
  export class TexturedLitMeshGeometryCreateParams extends MeshGeometryCreateParams {
    da: OctEncodedNormalList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    db: QPoint2dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    dc: GLES.Texture:
    dd: Material;
  }
  export class PolylineGeometry extends IndexedGeometry {
    ca: QBufferHandle3d; // ./Handle.ts
    cb: BufferHandle;
    cc: FeatureIndices;
    cd: FloatPreMulRgba;
    ce: NonUniformColor;
    cf: LineCode;
    ch: TechniqueId;
    ci: RenderPass;
    cj: RenderOrder:
    ck: ColorData;
  }
  export class PolylineGeometryCreateParams extends IndexedGeometryCreateParams {
    ca: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cc: ColorTable:
    cd: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ce: LineCode;
    cf: ColorTable;
    cg: LinePixels;
  }
  export class EdgeGeometry extends IndexedGeometry {
    ca: QBufferHandle3d; // ./Handle.ts
    cb: BufferHandle;
    cc: FeatureIndices;
    cd: FloatPreMulRgba;
    ce: NonUniformColor;
    cf: LineCode;
    cg: TechniqueId;
    ch: RenderPass;
    ci: RenderOrder:
    cj: ColorData;
  }
  export class EdgeGeometryCreateParams extends IndexedGeometryCreateParams {
    ca: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cc: ColorTable;
    cd: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ce: LineCode;
    ch: LinePixels;
  }
  export class SilhouetteEdgeGeometry extends EdgeGeometry {
    da: BufferHandle;
    db: SilhouetteEdgeGeometry;
    dc: TechniqueId;
    dd: RenderOrder;
  }
  export class SilhouetteEdgeGeometryCreateParams extends EdgeGeometryCreateParams {
    da: OctEncodedNormalPairList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    db: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    dd: ColorTable;
    de: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    df: LinePixels;
  }
  export class PointStringGeometry extends IndexedGeometry {
    ca: FeatureIndices;
    cb: FloatPreMulRgba;
    cc: NonUniformColor;
    cd: TechniqueId;
    ce: RenderPass;
    cf: RenderOrder;
    cg: ColorData;
  }
  export class PointStringGeometryCreateParams extends IndexedGeometryCreateParams {
    ca: ColorTable;
    cb: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cc: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class PointCloudGeometry extends CachedGeometry {
    ba: BufferHandle;
    bb: GLsizei;
    bc: TechniqueId;
    bd: RenderPass;
    be: RenderOrder;
  }
  export class PointCloudGeometryCreateParams extends CachedGeometryCreateParams {
    bb: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class ViewportQuadGeometry extends IndexedGeometry {
    ca: TechniqueId;
    cb: RenderPass;
    cc: RenderOrder;
  }
  export class TexturedViewportQuadGeometry extends ViewportQuadGeometry {
    da: QBufferHandle2d; // ./Handle.ts
    db: GLuint;
  }
  export class MultiTexturedViewportQuadGeometry extends TexturedViewportQuadGeometry {
    ea: GLuint;
    eb: TechniqueId;
    ec: BufferHandle;
  }
  export class CompositeGeometry extends MultiTexturedViewportQuadGeometry {
    fa: GLuint;
    fb: TechniqueId;
    fc: BufferHandle;
    fd: GLESTexture;
    fe: CompositeFlags;
  }
  export class SingleTextureViewportQuadGeometry extends MultiTexturedViewportQuadGeometry {
    fa: GLuint;
    fb: TechniqueId;
    fc: GLESTexture;
  }
  // DRAWCOMMAND
  export class ShaderProgramParams {
    a: Target;
    b: Matrix4;
    c: RenderPass;
    d: CachedGeometry;
    e: Transform;
  }
  export class DrawParams extends ShaderProgramParams {
    ba: CachedGeometry;
    bb: Matrix4;
    bc: RenderPass;
    bd: ShaderProgramParams;
    be: Transform;
  }
  export const enum PushOrPop { Push, Pop }
  export const enum OpCode { DrawBatchPrimitive, DrawOvrPrimitive, PushBranch, PopBranch }
  export class BatchPrimitive {
    a: Primitive;
    d: GLESBatch;
  }
  export class OvrPrimitive {
    a: Primitive;
    b: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class DrawCommand {
    a: BatchPrimitive;
    b: OvrPrimitive;
    c: GLESBatch;
    d: OpCode;
    e: GLESBranch;
    f: PushOrPop;
    g: RenderPass;
    h: TechniqueId;
    i: LUTDimension;
    j: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    k: RenderOrder;
    l: ShaderProgramExecutor;
  }
  export class DrawCommands {
    a: DrawCommand;
    c: assert; // was BeAssert;
  }
  export class RenderCommands {
    a: Target;
    b: DrawCommands;
    c: BranchStack;
    d: GLESBatch;
    e: RenderPass;
    f: GraphicList;
    g: DecorationList;
    h: GLESGraphic;
    j: Graphic;
    k: DrawCommand;
    l: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    m: GLESBranch;
    n: assert; // was BeAssert;
    p: ViewFlags;
    q: Primitive;
    r: Render.Decorations; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    u: RenderCommands;
    w: CompositeFlags;
  }
  // EGLDisplayContext
  export class EGLPlatformParameters {
    a: EGLint;
  }
  export class EGLDisplayContext {
    a: EGLConfig;
    b: EGLDisplay;
    c: EGLContext;
    d: EGLint;
    e: EGLBoolean;
    f: EGLPlatformParameters;
  }
  export class EGLDisplaySurface {
    a: EGLDisplayContext;
    b: EGLSurface; 
    c: GLuint;
    d: EGLNativeWindowType;
  }
  // FrameBuffer
  export const enum BindState { Unbound, Bound, BoundWithAttachments, Suspended }
  export class FrameBuffer {
    c: GLESTexture;
    d: GLuint;
    e: BindState;
    f: GLenum;
    g: Render.Image; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    h: Point2d;
  }
  export class FrameBufferBinder {
    a: FrameBuffer;
  }
  // Graphic
  export class ColorTable {
    a: Render.Image; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    c: ColorDef;
    d: LUTDimension;
    e: GLESTexture;
    f: ColorIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class GLESGraphic extends Render.Graphic {
    a: RenderCommands;
    b: DrawCommands;
    c: Primitive;
    d: GLESBatch;
    e: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
  }
  export class Uniform {
    a: FloatRgba;
    b: OvrFlags;
    c: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    d: FeatureTable; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    e: FeatureSymbologyOverrides; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    f: DgnElementIdSet; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    g: DgnElementId; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
  }
  export class NonUniform {
    a: LUTParams;
    b: FeatureTable; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    c: GLESTexture;
    d: FeatureSymbologyOverrides; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    e: DgnElementIdSet; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    f: DgnElementId; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
  }
  export class FeatureOverrides {
    a: Uniform;
    b: NonUniform;
    c: Target;
    d: BeTimePoint;
    e: LUTDimension;
    f: FeatureTable; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    g: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    i: GLESTexture;
  }
  export class PickTable {
    a: LUTDimension;
    b: assert; // was BeAssert;
    c: GLESTexture;
    d: FeatureTable; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    e: DgnElementId; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    f: LUTParams;
  }
  export class GLESBatch extends GLESGraphic {
    aa: Graphic;
    ab: FeatureTable; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ad: PickTable;
    ae: RenderCommands;
    af: Target;
    ag: DrawCommands;
    ah: assert; // was BeAssert;
    ai: FeatureOverrides;
  }
  export class GLESBranch extends GLESGraphic {
    aa: GraphicBranch; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ab: Transform;
    ac: ClipPlane;
    ad: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
    ae: ClipVector;
    af: RenderCommands;
    ag: DrawCommands;
    ah: Matrix4d; // was DMatrix4d
    ai: ViewFlags;
    aj: GLESBatch;
    ak: ShaderProgramExecutor;
  }
  export class WorldDecorations extends GLESBranch {
    bc: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bd: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
    be: ViewFlags;
    bf: DecorationList;
    bg: GLESBranch;
  }
  export class GLESList extends GLESGraphic {
    ab: Graphic;
    ac: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
    ad: RenderCommands;
    ae: DrawCommands;
    af: GLESBatch;
  }
  export class PrimitiveParams {
    a: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    b: QPoint3d; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class Primitive extends GLESGraphic {
    aa: CachedGeometry;
    ab: RenderPass;
    ac: LUTDimension;
    ad: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ae: RenderOrder;
    af: TechniqueId;
    ag: Target;
    ah: ShaderProgramExecutor;
  }
export class Features {
    b: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class IndexedPrimitiveParams extends PrimitiveParams {
    aa: Features;
    ab: ColorTable;
    ac: ColorIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ad: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class IndexedPrimitive extends Primitive {
    ca: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
  }
  export class TriMeshParams extends IndexedPrimitiveParams {
    ba: OctEncodedNormalList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bb: QPoint2dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bc: Render.Texture; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bd: Render.Material; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    be: TriMeshArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bf: CachedGeometry;
    bg: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class TriMeshPrimitive extends IndexedPrimitive {
    da: TriMeshParams;
    db: FillFlags; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    dc: TriMeshArgs;
  }
  export const enum PolylineParam {
    kNone = 0,
    kSquare = 1*3,
    kMitter = 2*3,
    kMiterInsideOnly = 3*3,
    kJointBase = 4*3,
    kNegatePerp = 8*3,
    kNegateAlong = 16*3,
    kNoneAdjWt = 32*3,
  }
  export class PolyLineVertex {
    a: FPoint3d;  //GeomLibs/PublicAPI/Geom/FPoint3d.h
    b: PolylineParam;
  }
  export class PolylineParams extends IndexedPrimitiveParams {
    ba: PolylineParam;
    bb: Vertex;
    bc: IndexedPolylineArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bd: CachedGeometry;
    be: QPoint3dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bg: QPoint3d; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bh: PolyLineVertex;
    bi: FPoint3d; //GeomLibs/PublicAPI/Geom/FPoint3d.h
  }
  export class PolylinePrimitive extends IndexedPrimitive {
    da: IndexedPolylineArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    db: PolylineParams;
  }
  export class EdgeParams extends IndexedPrimitiveParams {
    bc: LinePixels;
    bd: ColorIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    be: FeatureIndex; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bf: MeshEdgeArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class EdgePrimitiveBase  extends IndexedPrimitive {}
  export class EdgePrimtive extends EdgePrimitiveBase {
    ea: EdgeParams;
    eb: assert; // was BeAssert;
    ec: MeshEdgeArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class SilhouetteEdgeParams extends EdgeParams {
    ca: OctEncodedNormalPairList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cb: SilhouetteEdgeArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    cd: OctEncodedNormalPair; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class SilhouetteEdgePrimitive extends EdgePrimitiveBase {
    ea: SilhouetteEdgeParams;
    eb: assert; // was BeAssert;
  }
  export class PointStringParams extends IndexedPrimitiveParams {
    ba: QPoint2dList; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bb: IndexedPolylineArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class PointStringPrimitive extends IndexedPrimitive {
    da: PointStringParams;
    db: IndexedPolylineArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class PointCloudParams extends PrimitiveParams {
    ab: PointCloudArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class PointCloudPrimitive extends Primitive {
    ba: PointCloudParams;
    bc: assert; // was BeAssert;
    be: PointCloudArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bf: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
  }
  // MATERIAL
  export class Material extends Render.Material {
    a: FloatRgb;
    b: assert; // was BeAssert;
    c: Render.Material.CreateParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    d: System;
  }
  // MATRIX
  export namespace Matrix4dUtils {
    export function frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4d;
    export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4d;
  }
  export namespace TransformUtils {
    export function lookAt(eye: Point3d, center: Point3d, up: Vector3d): Transform;
    export function lookIn(eye: Point3d, normalizedViewX: Vector3d, normalizedViewY: Vector3d, normalizedViewZ: Vector3d): Transform;
  }
  export class Matrix3 {
    a: RotMatrix;
  }
  export class Matrix4 {
    a: Point3d;
    b: Vector3d;
    c: Transform;
    d: Matrix4d;
    g: Transform;
    h: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
  }
  // SceneCompositor
  export class SceneCompositor {
    a: GLsizei;
    b: GLESTexture;
    c: FrameBuffer;
    e: CachedGeometry;
    g: Target;
    h: RenderCommands;
    i: RenderPass;
    i: GLint;
    j: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    k: ByteStream;
    l: RenderOrder;
    m: ViewRect;
    n: DgnElementId; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    o: BeFileName;
    p: IPixelDataBuffer;
    q: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    r: PixelData.Selector;
  }
  // ShaderUtils
  export namespace ShaderUtils {
    export function compileShader(type: GLenum, source: string): GLuint;
    export function compileShaderFromFile(type: GLenum, sourcePath: string): GLuint;
    export function compileProgram(vsSource: string, fsSource: string): GLuint;
    export function compileProgramFromFiles(vsPath: string, fsPath: string): GLuint;
  }
  // ShaderBuilder
  // Describes the data type of a shader program variable.
  export const enum VariableType {
    Boolean, // bool
    Int, // int
    UInt, // uint
    Float, // float
    Vec2, // vec2
    Vec3, // vec3
    Vec4, // vec4
    Mat3, // mat3
    Mat4, // mat4
    Sampler2D, // sampler2D
    SamplerCube, //samplerCube
    COUNT
  }
  // Describes the qualifier associated with a shader program variable.
  export const enum VariableScope {
    Local, // no qualifier
    Varying, // varying
    Uniform, // uniform
    Attribute, // attribute

    COUNT
  }
  // Describes the declared or undeclared precision of a shader program variable.
  export const enum VariablePrecision {
    Default, // undeclared precision - variable uses the explicit or implicit precision default for its type
    Low, // lowp
    Medium, // mediump
    High, // highp

    COUNT
  }
  export const enum ShaderType {
    Fragment = 1 << 0,
    Vertex = 1 << 1,
    Both = Fragment | Vertex
  }
  export class ShaderVariable {
    a: T_AddVariableBinding;
    b: VariableType;
    c: VariableScope;
    d: VariablePrecision;
    e: assert; // was BeAssert;
  }
  export class ShaderVariables {
    b: ShaderVariable;
    c: ShaderVariableCR;
    d: T_AddVariableBinding;
    e: VariableType;
    f: VariableScope;
    g: ShaderProgram;
  }
  // Describes the optional and required components which can be assembled into complete
  export const enum VertexShaderComponent {
    // (Optional) Return true to discard this vertex before evaluating feature overrides etc, given the model-space position.
    // bool checkForEarlyDiscard(vec4 rawPos)
    CheckForEarlyDiscard,
    // (Optional) Compute feature overrides like visibility, rgb, transparency, line weight.
    ComputeFeatureOverrides,
    // (Optional) Return true if this vertex should be "discarded" (is not visible)
    // bool checkForDiscard()
    // If this returns true, gl_Position will be set to 0; presumably related vertices will also do so, resulting in a degenerate triangle.
    // If this returns true, no further processing will be performed.
    CheckForDiscard,
    // (Required) Return this vertex's position in clip space.
    // vec4 computePosition(vec4 rawPos)
    ComputePosition,
    // (Optional) Compute the clip distance to send to the fragment shader.
    // void calcClipDist(vec4 rawPos)
    CalcClipDist,
    // (Optional) Add the element id to the vertex shader.
    // void computeElementId()
    AddComputeElementId,

    COUNT
  }
  // Describes the optional and required components which can be assembled into complete
  export const enum FragmentShaderComponent {
    // (Optional) Return true to immediately discard this fragment.
    // bool checkForEarlyDiscard()
    CheckForEarlyDiscard,
    // (Required) Compute this fragment's base color
    // vec4 computeBaseColor()
    ComputeBaseColor,
    // (Optional) Apply material overrides to base color
    // vec4 applyMaterialOverrides(vec4 baseColor)
    ApplyMaterialOverrides,
    // (Optional) Apply feature overrides to base color
    // vec4 applyFeatureColor(vec4 baseColor)
    ApplyFeatureColor,
    // (Optional) Adjust base color after material and/or feature overrides have been applied.
    // vec4 finalizeBaseColor(vec4 baseColor)
    FinalizeBaseColor,
    // (Optional) Return true if this fragment should be discarded
    // Do not invoke discard directly in your shader components - instead, return true from this function to generate a discard statement.
    // bool checkForDiscard(vec4 baseColor)
    CheckForDiscard,
    // (Optional) Return true if the alpha value is not suitable for the current render pass
    // bool discardByAlpha(float alpha)
    DiscardByAlpha,
    // (Optional) Apply lighting to base color
    // vec4 applyLighting(vec4 baseColor)
    ApplyLighting,
    // (Optional) Apply monochrome overrides to base color
    // vec4 applyMonochrome(vec4 baseColor)
    ApplyMonochrome,
    // (Optional) Apply white-on-white reversal to base color
    ReverseWhiteOnWhite,
    // (Optional) Apply flash hilite to lit base color
    // vec4 applyFlash(vec4 baseColor)
    ApplyFlash,
    // (Required) Assign the final color to gl_FragColor or gl_FragData
    // void assignFragData(vec4 baseColor)
    AssignFragData,
    // (Optional) Discard if outside any clipping planes
    // void applyClipping()
    ApplyClipping,

    COUNT
  }
  export class ShaderBuilder {
    a: FragmentShaderComponent;
    b: ShaderVariables;
    c: assert; // was BeAssert;
    d: ShaderVariables;
    f: T_AddVariableBinding;
    g: VariablePrecision;
    h: VariableType;
  }
  export class FragmentShaderBuilder extends ShaderBuilder {
    a: FragmentShaderComponent;
  }
  export class ProgramBuilder {
    a: VertexShaderBuilder;
    b: FragmentShaderBuilder;
    c: GeometryType;
    d: VertexShaderBuilder;
    e: FragmentShaderBuilder;
    h: ShaderVariable;
    i: ShaderType;
    j: T_AddVariableBinding;
    k: VariableScope;
    l: ShaderProgram;
  }
  // ShaderProgram 
  export class ProgramBinding {
    a: GLuint;
    b: Handle;
    c: UniformHandle; // ./Handle.ts
    d: assert; // was BeAssert;
  }
  export class ShaderBinding extends ProgramBinding {
    a: UniformHandle; // ./Handle.ts
    b: ShaderProgramParams;
    c: T_Use;
  }
  export class GraphicBinding extends ProgramBinding {
    a: T_Bind;
    b: GraphicBinding;
    c: DrawParams;
    d: AttributeHandle; // ./Handle.ts
    e: assert; // was BeAssert;
    g: ShaderBinding;
    h: GraphicBinding;
  }
  export const enum CompileStatus { Success, Failure, Uncompiled, }
  export class ShaderProgram {
    a: ShaderProgramExecutor;
    b: CompileStatus;
    c: GLuint;
    d: ShaderBindings;
    e: GraphicBindings;
    f: GeometryType;
    g: DrawParams;
    h: ShaderProgramParams;
    i: ShaderBinding;
    j: GraphicBinding;
  }
  export class ShaderProgramExecutor {
    a: ShaderProgram;
    b: ShaderProgramParams;
    c: Target;
    d: RenderPass;
    g: Transform;
    h: ViewFlags;
    i: FeatureOverrides;
    j: PickTable;
    k: DrawParams;
    n: GLESBranch;
  }
  // ShaderSource
  export namespace ShaderSource {
    export function addViewport(ShaderBuilderR): void; // uniform vec4 u_viewport // the dimensions of the viewport
    export function addViewportTransformation(ShaderBuilderR): void; // uniform mat4 u_viewportTransformation // transforms NDC to window coordinates
    export function addRenderPass(ShaderBuilderR): void; // uniform float u_renderPass; // RenderPass value indicating current render pass plus kRenderPass_* constants
    export function addFrustumPlanes(ShaderBuilderR): void; // uniform vec4 u_frustumPlanes; // { top, bottom, left, right }
    export function addFrustum(ShaderBuilderR): void; // uniform vec3 u_frustum; // { near, far, type } type:0=2d,1=ortho,2=perspective; plus kFrustumType_* constants
    export class Lighting {
      a: ShaderProgram;
      b: FragmentShaderBuilder;
      c: ProgramBuilder;
    }
  }
  // System
  export class Capabilities {}
  export class Light extends Render.Light {
    a: Lighting;
    b: ColorDef;
    c: Vector3d;
    d: Point3d;
  }
  export class ViewportQuad {
    a: Point3dList;
  }
  export class TexturedViewportQuad extends ViewportQuad {
    a: Point2dList;
  }
  export const enum ContextState { Uninitialized, Success, Error };
  export class System extends Render.System {
    a: ContextState;
    b: DisplayContext;
    c: DisplaySurface;
    d: Techniques;
    e: ContextState;
    f: GLESTexture;
    g: RenderState;
    h: Capabilities;
    i: TexturedViewportQuad;
    j: BoundFrameBufferStack;
    k: GLESCubemap;
    l: Render.Target;
    m: Render.Texture;
    n: Render.Material;
    o: Render.GraphicBuilder;
    p: Render.Graphic;
    q: Graphic;
    e: Light;
    s: Vector3d;
    t: Point;
    u: DisplayContext;
    v: Techniques;
    w: DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnDb.h
    x: ClipVector;
    y: Transform;
    aa: FeatureTable; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ab: GraphicBranch; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ac: PointCloudPrimitive;
    ad: TriMeshPrimitive;
    ae: PointCloudArgs;
    af: MeshEdgeArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ag: TriMeshArgs;
    ai: SilhouetteEdgeArgs;
    ak: lighting;
    al: DisplayContext;
    am: Techniques;
    an: RenderState;
    ao: GLESTexture;
  }
      // static void OnTextureAllocated(GLESTexture const& texture);
      // static void OnTextureFreed(GLESTexture const& texture);
      // static void OnBufferAllocated(BufferHandleCR buffer);
      // static void OnBufferFreed(BufferHandleCR buffer);
  //=======================================================================================
  // Target.h
  //=======================================================================================
  export const enum FrustumUniformType {
    TwoDee, Orthographic, Perspective
  }
  export const enum FrustumUniformPlane {
    kTop,
    kBottom,
    kLeft,
    kRight,
    kNear,
    kFar,
    kType,
    kCOUNT
  }
  export class FrustumUnifoms {
    a: FrustumUniformPlane;
    b: FrustumUniformType;
  }
  export class GLESClips {
    a: ClipVector;
    b: ClipPlane;
    c: Transform;
  }
  export class ShaderLight {
    a: Target;
    b: Vector3d;
  }
  export class Target extends Render.Target {
    a: System;
    b: Render.TileSizeAdjuster;
    c: ColorDef;
    d: HiliteSettings;
    e: GLESClips;
    f: Matrix4;
    g: Transform;
    h: RenderCommands;
    l: SceneCompositor;
    m: Point3d;
    n: BranchStack;
    o: Frustum;
    p: bset;
    q: GLESBatch;
    r: BeTimePoint;
    s: FeatureOverrides;
    t: FeatureSymbologyOverrides; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    u: OvrGraphicParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    v: DgnElementIdSet; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    w: PickTable;
    x: FrustumUniforms;
    y: DgnElementId; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    z: BranchState;
    aa: WorldDecorations;
    ab: EdgeOverrides;
    ac: Vector3d;
    ae: GLES.Texture;
    ef: Image;
    eg: IPixelDataBuffer;
    eh: PixelData;
    ai: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    aj: BentleyStatus;
    ak: StopWatch;
    al: Plan;
    am: GraphicList;
    an: ClipVector;
    ao: Point2d;
    aq: SceneLights;
    ar: Render.Device;
    as: Techniques;
    at: ViewFlags;
    au: GLESBranch;
    ax: BranchState;
    az: assert; // was BeAssert;
    ba: GLESBatch;
    bb: EdgeOverrides;
    bc: RenderPass;
    bd: LineCode;
    be: FloatPreMulRgba;
  }
  export class OnScreenTarget extends Target {
    a: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    b: FrameBuffer;
    c: Render.Device;
    d: Render.Target;
    e: System;
  }
  export class OffScreenTarget extends Target {
    a: FrameBuffer;
    b: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    c: System;
    d: Render.Device;
    e: Render.Target;
  }
  // Technique 
  export class ShaderPrograms {
    a: ShaderProgram;
    b: assert; // was BeAssert;
  }
  export class Technique {
    a: ShaderProgram;
    b: ShaderPrograms;
    c: TechniqueFlags;
  }
  export class SingularTechnique extends Technique {
    a: ShaderProgram;
    b: TechniqueFlags;
    c: ShaderPrograms;
  }
  export class VariedTechnique extends Technique {
    a: ShaderProgram;
    b: TechniqueFlags;
    c: ProgramBuilder;
    d: FeatureDimensions;
    e: WithClipVolume;
    f: FSOptions;
    g: FragmentShaderComponent;
    h: VertexShaderComponent;
    k: ShaderSource;
    l: FeatureSymbology;
  }
  export const enum ShaderIndex {
    kOpaque = 0,
    kTranslucent = 2,
    kOverrides = 4,
    kMonochrome = 8,
    kFeature = 16,
    kHilite = NumFeatureVariants(kFeature),
    kClip = kHilite + NumHiliteVariants()
  }
  export class SurfaceTechnique extends VariedTechnique {
    a: ShaderIndex;
    b: TechniqueFlags;
    c: WithClipVolume;
    d: LUTDimension;
    e: ShaderSource;
    f: FeatureDimensions;
    g: FSOptions;
  }
  export class PolylineTechnique extends VariedTechnique {
    a: ShaderIndex;
    b: TechniqueFlags;
    c: ShaderSource;
    d: FeatureDimensions;
    e: LUTDimension;
    f: FSOptions;
  }
  export class EdgeTechnique extends VariedTechnique {
    a: ShaderIndex;
    b: TechniqueFlags;
    c: FeatureDimensions;
    d: ShaderSource;
    e: FSOptions;
  }
  export class SilhouetteEdgeTechnique extends EdgeTechnique {}
  export class PointStringTechnique extends VariedTechnique {
    a: ShaderIndex;
    b: TechniqueFlags;
    c: WithClipVolume;
    d: LUTDimension;
    e: ShaderSource;
    f: FSPOptions;
  }
  export class PointCloudTechnique extends VariedTechnique {
    a: TechniqueFlags;
    b: WithClipVolume;
    c: FragmentShaderComponent;
    d: ShaderSource;
  }
  export class Techniques {
    b: Technique;
    c: TechniqueId;
    d: Target;
    e: RenderPass;
    f: DrawParams;
  }
  // Texture
  export const enum TextureFlags {
    None = 0,
    UseMipMaps = 1 << 0,
    Interpolate = 1 << 1,
    PreserveData = 1 << 2,
  }
  export const enum GLESTextureInternalFormat {
  //   Rgb             = GL_RGB,
  //         Rgba            = GL_RGBA,
  // #if defined(GLES3_CONFORMANT)
  //         Rgba32f         = GL_RGBA32F,
  //         Depth24Stencil8 = GL_DEPTH24_STENCIL8,
  //         R8              = GL_R8,
  //         DepthComponent24= GL_DEPTH_COMPONENT24,
  // #else
  //         DepthStencil    = GL_DEPTH_STENCIL,
  //         Luminance       = GL_LUMINANCE,
  //         DepthComponent  = GL_DEPTH_COMPONENT,
  // #endif
  }
  export const enum GLESTextureFormat {
    // Rgb             = GL_RGB,
    //         Rgba            = GL_RGBA,
    //         DepthStencil    = GL_DEPTH_STENCIL,
    //         DepthComponent  = GL_DEPTH_COMPONENT,
    // #if defined(GLES3_CONFORMANT)
    //         Red             = GL_RED,
    // #else
    //         Luminance       = GL_LUMINANCE,
    // #endif
  }
  export const enum GLESTextureDataType {
    Float           = GL_FLOAT,
    UnsignedByte    = GL_UNSIGNED_BYTE,
    UnsignedInt24_8 = GL_UNSIGNED_INT_24_8,
    UnsignedInt     = GL_UNSIGNED_INT,
  }
  export class GLESTextureCreateParams {
    a: GLESTextureFormat;
    b: GLESTextureDataType;
    c: ByteStream;
    d: Point2d;
    e: GLESTextureInternalFormat;
    f: WrapMode;
    g: TextureFlags;
    h: Render.Image;
  }
  export class GLESTextureUpdater {
    a: ByteStream;
    b: OvrFlags;
  }
  export class GLESTexture {
    a: GLESTextureCreateParams;
    b: GLuint;
    c: TextureUnit;
    d: UniformHandle; // ./Handle.ts
    e: GLsizei;
    f: GLESTextureFormat;
    g: GLESTextureDataType;
    h: GLESTextureUpdater;
    i: ImageUpdater;
  }
  export class ImageTexture extends GLESTexture {
    a: Image;
    b: Render.Texture;
    c: IsTranslucent;
  }
  export class ColorTexture extends GLESTexture {
    a: GLsizei;
    b: GLESTextureInternalFormat;
    c: GLESTextureDataType;
    d: IsTranslucent;
  }
  export class Texture extends Render.Texture {
    a: ImageTexture;
    b: ImageSource;
    c: IsTranslucent;
    d: GLESTextureCreateParams;
    e: UnformHandle; // ./Handle.ts
    f: TextureUnit;
    g: assert; // was BeAssert;
    h: Image;
  }
  export class GLESCubeMap {
    a: GLsizei;
    b: GLint;
    c: CLenum;
    d: ByteStream;
    e: UniformHandle; // ./Handle.ts
    f: TextureUnit;
    g: GLuint;
  }
}