import { ClipVector } from "@bentley/geometry-core/lib/numerics/ClipVector";
import { ClipPlane } from "@bentley/geometry-core/lib/numerics/ClipPlanes";
import { Matrix4d } from "@bentley/geometry-core/lib/numerics/Geometry4d";
import { Point3d, Point2d, Vector3d, Vector2d } from "@bentley/geometry-core/lib/PointVector";
import { RotMatrix, Transform} from "@bentley/geometry-core/lib/Transform";
import { BentleyStatus } from "@bentley/bentleyjs-core/lib/Bentley";
import { BeTimePoint } from "@bentley/bentleyjs-core/lib/Time";
import { Range3d, Range2d } from "@bentley/geometry-core/lib/Range";
import { LineSegment3d } from "@bentley/geometry-core/lib/curve/LineSegment3d";
import { Id64, Id64Set } from "@bentley/bentleyjs-core/lib/Id";

import { assert } from "chai";

import { ColorDef } from "../../common/ColorDef";
import { Decorations, DecorationList, GraphicList, ViewFlags, LinePixels, Hilite, GraphicBuilder, FillDisplay, GraphicParams } from "../../common/Render";
import { Frustum } from "../../common/Frustum";
import { Light } from "../../common/Lighting";

import { IModelConnection } from "../IModelConnection";
import { Viewport } from "../Viewport";

import { BranchState, BranchStack } from "./BranchState";
import { FeatureIndices } from "./CachedGeometry";
import { LineCode, EdgeOverrides } from "./EdgeOverrides";
import { LUTDimension, LUTParams, FeatureDimension, FeatureDimensions, FeatureDimensionsIterator } from "./FeatureDimensions";
import { FeatureIndexType, FeatureIndex } from "./FeatureIndex";
import { FloatRgb, FloatRgba, FloatPreMulRgba } from "./FloatRGBA";
import { GL } from "./GL";
import { RenderPass, GeometryType, TextureUnit, RenderOrder, isPlanar, isSurface, CompositeFlags, SurfaceFlags, OvrFlags, IsTranslucent } from "./RenderFlags";
import { RenderStateFlags, RenderStateBlend, RenderState } from "./RenderState";
import { Mode, WithClipVolume, TechniqueFlags } from "./TechniqueFlags";
import { BuiltInTechniqueId, TechniqueId } from "./TechniqueId";
import { Handle, BufferHandle, QBufferHandle2d, QBufferHandle3d, AttributeHandle, UniformHandle } from "./Handle";
import { PushOrPop, OpCode } from "./DrawCommand";
import { BindState } from "./FrameBuffer";
import { IndexedPrimitiveParamsFeatures, PolylineParam, PolylineParamVertex } from "./Graphic";
import { VariableType, VariableScope, VariablePrecision, ShaderType, VertexShaderComponent, FragmentShaderComponent } from "./ShaderBuilder";
import { CompileStatus } from "./ShaderProgram";
import { ShaderSource } from "./ShaderSource";
import { ContextState, Capabilities } from "./System";
import { FrustumUniformType, FrustumUniforms, GLESClips } from "./Target";
import { TextureFlags } from "./Texture";
import { Matrix3, Matrix4 } from "./Matrix";
import { QPoint3d, QPoint2d, QPoint3dList, QPoint2dList, QParams3d } from "./QPoint";
import { OctEncodedNormal, OctEncodedNormalList, OctEncodedNormalPair, OctEncodedNormalPairList } from "./OctEncodedNormal";

// RENDER.H
export enum OvrGraphicParamFlags {
}
export class OvrGraphicParams {
  a: GraphicParams;
  b: Render.Material;  // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  c: ColorDef;
  d: LinePixels;
  e: Render.Texture;  // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export class Graphic {
  a: IModelConnection; // was DgnDb
}
export class GraphicBuilderTileCorners {
  a: Point3d;
}
export class GraphicBuilderCreateParams {
  a: IModelConnection; // was DgnDb
  b: Transform;
  c: Viewport; // was DgnViewport
}
export class ColorIndex {
}
export enum FillFlags {
}
export class IndexedPolylineArgsPolyline {
  a: Point3d;
}
export class IndexedPolylineArgs {
  a: Point3d;
  b: QPoint3d;
  c: IndexedPolylineArgsPolyline;
  d: ColorIndex;
  e: FeatureIndex;
  f: LinePixels;
}
export class MeshEdge {
}
export class MeshEdgeArgs {
  a: MeshEdge;
  b: QPoint3d;
  c: FeatureIndex;
  d: ColorIndex;
  e: QParams3d; // was QPoint3d.Params
  f: LinePixels;
}
export class MeshPolyline {
  a: Point3d;
}
export class MeshEdges {
  a: MeshEdge;
  b: MeshPolyline;
  c: OctEncodedNormalPairList;
}
export class SilhouetteEdgeArgs {
  a: OctEncodedNormalPair;
  b: MeshEdges;
  c: QPoint3d;
  d: QParams3d; // was QPoint3d.Params;
}
export class PointCloudArgs {
  a: QPoint3d;
  b: Range3d;
}
export enum DgnGeometryClass {
}
export class Feature {
  a: Id64; // was DgnElementId
  b: Id64; // was SubCategoryId
  c: DgnGeometryClass;
}
export class FeatureTable {
  a: Feature;
  b: bmap;
}
export class FeatureSymbologyOverridesAppearance {
  a: ColorDef;
  b: LinePixels;
}
export class FeatureSymbologyOverrides {
  a: Id64; // was DgnElementId;
  b: Id64; // was SubCategoryId
  c: bmap;
  d: Feature;
  e: DgnGeometryClass;
  f: FeatureSymbologyOverridesAppearance;
}
export class TileSizeAdjuster {
  a: Render.Target;  // DgnPlatform/PublicAPI/DgnPlatform/Render.h
}
export enum PixelDataGeometryType {}
export enum PixelDataPlanarity {}
export enum PixelDataSelector {}
export class PixelData {
  a: Id64; // was DgnElementId;
  b: PixelDataGeometryType;
  c: PixelDataPlanarity;
}
export class IPixelDataBuffer {
  a: PixelData;
}

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
    b: QPoint3d;
    c: QPoint3dList;
    d: ViewportQuad;
    e: BentleyStatus; // was StatusInt;
    f: BufferHandle;
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
    a: QPoint3dList;
  }

  export class IndexedGeometry extends CachedGeometry {
    ba: BufferHandle;
  } 

  export class IndexedGeometryCreateParams extends CachedGeometryCreateParams {
    ba: UInt32List; // ./GLESCommon.h
    bb: QPoint3dList;
  }

  export class MeshGeometry extends IndexedGeometry {
    ca: FloatPreMulRgba;
    cb: FeatureIndices;
    cc: FillFlags;
    cd: RenderPass;
    ce: ColorData;
    cf: MaterialData;
    cg: GLES.Texture;
    ch: NonUniformColor;
    ci: SurfaceFlags;
    cj: FeatureIndexType;
  }

  export class MeshGeometryCreateParams extends IndexedGeometryCreateParams {
    ca: QPoint3dList;
    cb: ColorDef;
    cc: FeatureIndex;
    cd: FillFlags;
  }

  export class TexturedMeshGeometry extends MeshGeometry {
    da: QBufferHandle2d; // ./Handle.ts
    db: RefCounted; // ?
    dc: GLES.Texture;
    dd: SurfaceFlags;
    de: TexturedMeshData;
  }

  export class TexturedMeshGeometryCreateParams extends MeshGeometryCreateParams {
    da: QPoint2dList;
    db: GLES.Texture;
  }
  export class LitMeshGeometry extends MeshGeometry {
    da: BufferHandle;
    db: NonUniformColor;
    dc: LitMeshData;
  }
  export class LitMeshGeometryCreateParams extends MeshGeometryCreateParams {
    da: OctEncodedNormalList;
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
    da: OctEncodedNormalList;
    db: QPoint2dList;
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
    ca: QPoint3dList;
    cc: ColorTable:
    cd: FeatureIndex;
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
    ca: QPoint3dList;
    cc: ColorTable;
    cd: FeatureIndex;
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
    da: OctEncodedNormalPairList;
    db: QPoint3dList;
    dd: ColorTable;
    de: FeatureIndex;
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
    cb: FeatureIndex;
    cc: QPoint3dList;
  }
  export class PointCloudGeometry extends CachedGeometry {
    ba: BufferHandle;
    bc: TechniqueId;
    bd: RenderPass;
    be: RenderOrder;
  }
  export class PointCloudGeometryCreateParams extends CachedGeometryCreateParams {
    bb: QPoint3dList;
  }
  export class ViewportQuadGeometry extends IndexedGeometry {
    ca: TechniqueId;
    cb: RenderPass;
    cc: RenderOrder;
  }
  export class TexturedViewportQuadGeometry extends ViewportQuadGeometry {
    da: QBufferHandle2d; // ./Handle.ts
  }
  export class MultiTexturedViewportQuadGeometry extends TexturedViewportQuadGeometry {
    eb: TechniqueId;
    ec: BufferHandle;
  }
  export class CompositeGeometry extends MultiTexturedViewportQuadGeometry {
    fb: TechniqueId;
    fc: BufferHandle;
    fd: GLESTexture;
    fe: CompositeFlags;
  }
  export class SingleTextureViewportQuadGeometry extends MultiTexturedViewportQuadGeometry {
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
  export class BatchPrimitive {
    a: Primitive;
    d: GLESBatch;
  }
  export class OvrPrimitive {
    a: Primitive;
    b: OvrGraphicParams;
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
    j: FeatureIndex;
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
    l: OvrGraphicParams;
    m: GLESBranch;
    n: assert; // was BeAssert;
    p: ViewFlags;
    q: Primitive;
    r: Decorations;
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
    d: EGLNativeWindowType;
  }
  // FrameBuffer
  export class FrameBuffer {
    c: GLESTexture;
    e: BindState;
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
    f: ColorIndex;
  }
  export class GLESGraphic extends Render.Graphic {
    a: RenderCommands;
    b: DrawCommands;
    c: Primitive;
    d: GLESBatch;
    e: IModelConnection; // was DgnDb
  }
  export class Uniform {
    a: FloatRgba;
    b: OvrFlags;
    c: OvrGraphicParams;
    d: FeatureTable;
    e: FeatureSymbologyOverrides;
    f: Id64Set; // Was DgnElementIdSet
    g: IModelConnection; // was DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
  }
  export class NonUniform {
    a: LUTParams;
    b: FeatureTable;
    c: GLESTexture;
    d: FeatureSymbologyOverrides;
    e: Id64Set; // Was DgnElementIdSet
    f: IModelConnection; // was DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
  }
  export class FeatureOverrides {
    a: Uniform;
    b: NonUniform;
    c: Target;
    d: BeTimePoint;
    e: LUTDimension;
    f: FeatureTable;
    g: OvrGraphicParams;
    i: GLESTexture;
  }
  export class PickTable {
    a: LUTDimension;
    b: assert; // was BeAssert;
    c: GLESTexture;
    d: FeatureTable;
    e: IModelConnection; // was DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    f: LUTParams;
  }
  export class GLESBatch extends GLESGraphic {
    aa: Graphic;
    ab: FeatureTable;
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
    ad: IModelConnection; // was DgnDb
    ae: ClipVector;
    af: RenderCommands;
    ag: DrawCommands;
    ah: Matrix4d; // was DMatrix4d
    ai: ViewFlags;
    aj: GLESBatch;
    ak: ShaderProgramExecutor;
  }
  export class WorldDecorations extends GLESBranch {
    bc: OvrGraphicParams;
    bd: IModelConnection; // was DgnDb
    be: ViewFlags;
    bf: DecorationList;
    bg: GLESBranch;
  }
  export class GLESList extends GLESGraphic {
    ab: Graphic;
    ac: IModelConnection; // was DgnDb
    ad: RenderCommands;
    ae: DrawCommands;
    af: GLESBatch;
  }
  export class PrimitiveParams {
    a: QPoint3dList;
    b: QPoint3d;
  }
  export class Primitive extends GLESGraphic {
    aa: CachedGeometry;
    ab: RenderPass;
    ac: LUTDimension;
    ad: FeatureIndex;
    ae: RenderOrder;
    af: TechniqueId;
    ag: Target;
    ah: ShaderProgramExecutor;
  }
  export class IndexedPrimitiveParams extends PrimitiveParams {
    aa: IndexedPrimitiveParamsFeatures;
    ab: ColorTable;
    ac: ColorIndex;
    ad: FeatureIndex;
  }
  export class IndexedPrimitive extends Primitive {
    ca: IModelConnection; // was DgnDb
  }
  export class TriMeshParams extends IndexedPrimitiveParams {
    ba: OctEncodedNormalList;
    bb: QPoint2dList;
    bc: Render.Texture; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bd: Render.Material; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    be: TriMeshArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    bf: CachedGeometry;
    bg: FillFlags;
  }
  export class TriMeshPrimitive extends IndexedPrimitive {
    da: TriMeshParams;
    db: FillFlags;
    dc: TriMeshArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class PolylineParams extends IndexedPrimitiveParams {
    ba: PolylineParam;
    bb: Vertex;
    bc: IndexedPolylineArgs;
    bd: CachedGeometry;
    be: QPoint3dList;
    bg: QPoint3d;
    bh: PolylineParamVertex;
    bi: FPoint3d; //GeomLibs/PublicAPI/Geom/FPoint3d.h
  }
  export class PolylinePrimitive extends IndexedPrimitive {
    da: IndexedPolylineArgs;
    db: PolylineParams;
  }
  export class EdgeParams extends IndexedPrimitiveParams {
    bc: LinePixels;
    bd: ColorIndex;
    be: FeatureIndex;
    bf: MeshEdgeArgs;
  }
  export class EdgePrimitiveBase  extends IndexedPrimitive {}
  export class EdgePrimtive extends EdgePrimitiveBase {
    ea: EdgeParams;
    eb: assert; // was BeAssert;
    ec: MeshEdgeArgs;
  }
  export class SilhouetteEdgeParams extends EdgeParams {
    ca: OctEncodedNormalPairList;
    cb: SilhouetteEdgeArgs;
    cd: OctEncodedNormalPair;
  }
  export class SilhouetteEdgePrimitive extends EdgePrimitiveBase {
    ea: SilhouetteEdgeParams;
    eb: assert; // was BeAssert;
  }
  export class PointStringParams extends IndexedPrimitiveParams {
    ba: QPoint2dList;
    bb: IndexedPolylineArgs;
  }
  export class PointStringPrimitive extends IndexedPrimitive {
    da: PointStringParams;
    db: IndexedPolylineArgs;
  }
  export class PointCloudParams extends PrimitiveParams {
    ab: PointCloudArgs;
  }
  export class PointCloudPrimitive extends Primitive {
    ba: PointCloudParams;
    bc: assert; // was BeAssert;
    be: PointCloudArgs;
    bf: IModelConnection; // was DgnDb
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
  // SceneCompositor
  export class SceneCompositor {
    b: GLESTexture;
    c: FrameBuffer;
    e: CachedGeometry;
    g: Target;
    h: RenderCommands;
    i: RenderPass;
    j: RenderState;
    k: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    l: ByteStream; // ?
    m: RenderOrder;
    n: ViewRect; // ./ViewRect from GLESRender.h
    o: IModelConnection; // was DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    q: string; // was BeFileName;
    u: IPixelDataBuffer;
    v: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    w: PixelDataSelector;
  }
  // ShaderUtils
  export namespace ShaderUtils {
    export function compileShader(type: GLenum, source: string): GLuint;
    export function compileShaderFromFile(type: GLenum, sourcePath: string): GLuint;
    export function compileProgram(vsSource: string, fsSource: string): GLuint;
    export function compileProgramFromFiles(vsPath: string, fsPath: string): GLuint;
  }
  // ShaderBuilder
  export class ShaderVariable {
    a: T_AddVariableBinding; // ./ShaderBuilder
    b: VariableType;
    c: VariableScope;
    d: VariablePrecision;
    e: assert; // was BeAssert;
    f: ShaderProgram;
  }
  export class ShaderVariables {
    b: ShaderVariable;
    c: T_AddVariableBinding; // ./ShaderBuilder
    d: VariableType;
    e: VariableScope;
    f: VariablePrecision;
    g: ShaderProgram;
  }
  export class ShaderBuilder {
    a: FragmentShaderComponent;
    b: ShaderVariables;
    c: assert; // was BeAssert;
    d: T_AddVariableBinding; // ./ShaderBuilder
    e: VariablePrecision;
    f: VariableType;
  }
  export class VertexShaderBuilder extends ShaderBuilder {
    aa: VertexShaderComponent;
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
    j: T_AddVariableBinding; // ./ShaderBuilder
    k: VariableScope;
    l: ShaderProgram;
  }
  // ShaderProgram 
  export class ProgramBinding {
    b: Handle;
    c: UniformHandle; // ./Handle.ts
    d: assert; // was BeAssert;
    e: System;
  }
  export class ShaderBinding extends ProgramBinding {
    a: UniformHandle; // ./Handle.ts
    b: ShaderProgramParams;
    c: T_Use;
  }
  export class GraphicBinding extends ProgramBinding {
    a: T_Bind; // ./ShaderProgram
    b: GraphicBinding;
    c: DrawParams;
    d: AttributeHandle; // ./Handle.ts
    e: assert; // was BeAssert;
    g: ShaderBinding;
    h: GraphicBinding;
  }
  export class ShaderProgram {
    a: CompileStatus;
    c: ShaderBindings;
    d: GraphicBindings;
    e: GeometryType;
    f: DrawParams;
    g: ShaderProgramParams;
    h: ShaderBinding;
    i: GraphicBinding;
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
  namespace ShaderSource {
    export function addViewport(ShaderBuilder): void; // uniform vec4 u_viewport // the dimensions of the viewport
    export function addViewportTransformation(ShaderBuilder): void; // uniform mat4 u_viewportTransformation // transforms NDC to window coordinates
    export function addRenderPass(ShaderBuilder): void; // uniform float u_renderPass; // RenderPass value indicating current render pass plus kRenderPass_* constants
    export function addFrustumPlanes(ShaderBuilder): void; // uniform vec4 u_frustumPlanes; // { top, bottom, left, right }
    export function addFrustum(ShaderBuilder): void; // uniform vec3 u_frustum; // { near, far, type } type:0=2d,1=ortho,2=perspective; plus kFrustumType_* constants
    export class Lighting {
      a: ShaderProgram;
      b: ProgramBuilder;
      c: FragmentShaderBuilder;
    }
    export class Vertex {
      a: GraphicBinding;
      b: DrawParams;
      c: VertexShaderBuilder;
    }
    export class Fragment {
      a: FragmentShaderBuilder;
    }
    export class LookupTable {
      a: ShaderBuilder;
    }
    export class Clipping {
      a: ShaderProgram;
      b: ProgramBuilder;
    }
    export class Color {
      a: ShaderProgram;
      b: ProgramBuilder;
      c: LUTDimension;
    }
    export class Monochrome {
      a: FragmentShaderBuilder;
    }
    export class Material {
      a: FragmentShaderBuilder;
    }
    export class Surface {
      a: ShaderBuilder;
      b: ProgramBuilder;
      c: LUTDimension;
      d: FeatureDimensions;
      e: WithClipVolume;
      f: FragmentShaderBuilder
    }
    export class Linear {
      a: ProgramBuilder;
      b: VertexShaderBuilder;
    }
    export class Polyline {
      a: ProgramBuilder;
      b: WithClipVolume;
      c: LUTDimension;
      d: FeatureDimensions;
    }
    export class Edge {
      a: ProgramBuilder;
      b: WithClipVolume;
      c: LUTDimension;
    }
    export class PointString {
      a: ProgramBuilder;
      b: WithClipVolume;
      c: LUTDimension;
      d: FeatureDimensions;
    }
    export class PointCloud {
      a: ProgramBuilder;
      b: WithClipVolume;
    }
    export class ViewportQuadCopyColor {
      a: ShaderProgram;
    }
    export class ViewportQuad {
      a: ProgramBuilder;
    }
    export class Translucency {
      a: ProgramBuilder;
    }
    export class Composite {
      a: ShaderProgram;
      b: CompositeFlags;
    }
    export class ClearPickAndColor {
      a: ProgramBuilder;
      b: ShaderProgram;
    }
    export class OITClearTranslucent {
      a: ProgramBuilder;
      b: ShaderProgram;
    }
    export class FeatureSymbologyHilite {
      a: FragmentShaderBuilder;
    }
    export class FeatureSymbologyPingPong {
      a: ShaderProgram;
    }
    export class FeatureSymbology {
      a: ProgramBuilder;
      b: FeatureDimensions;
      c: ShaderBuilder;
      d: FragmentShaderBuilder;
      e: VertexShaderBuilder;
      f: ShaderSource.FeatureSymbologyOptions;
    }
  }
  // System
  export class SystemLight extends Render.Light {
    a: Lighting.Light;
    b: ColorDef;
    c: Vector3d;
    d: Point3d;
    e: Render.System; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
  export class ViewportQuad {
    a: QPoint3dList;
  }
  export class TexturedViewportQuad extends ViewportQuad {
    a: QPoint2dList;
  }
  export class BoundFrameBufferStackBinding {
    a: FrameBuffer;
  }
  export class BoundFrameBufferStack {
      a: BoundFrameBufferStackBinding;
      b: FrameBuffer;
      c: GLESTexture;
  }
  export class System extends Render.System {
    a: ContextState;
    b: DisplayContext; // ./EGLDisplayContext.h
    c: DisplaySurface; // ./EGLDisplayContext.h
    d: Techniques;
    e: ContextState;
    f: GLESTexture;
    g: RenderState;
    h: Capabilities;
    i: TexturedViewportQuad;
    j: BoundFrameBufferStack;
    k: GLESTexture;
    l: Render.Target; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    m: Render.Texture; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    n: Render.Material; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    o: GraphicBuilderCreateParams;
    p: Render.Graphic;
    q: Graphic;
    r: Light;
    s: Vector3d;
    t: Point3d;
    v: Techniques;
    w: IModelConnection; // was DgnDb
    x: ClipVector;
    y: Transform;
    aa: FeatureTable;
    ab: GraphicBranch; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ac: PointCloudPrimitive;
    ad: TriMeshPrimitive;
    ae: PointCloudArgs;
    af: MeshEdgeArgs;
    ag: TriMeshArgs; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ai: SilhouetteEdgeArgs;
    aj: Lighting; // // DgnPlatform/PublicAPI/DgnPlatform/Lighting.h
  }
      // static void OnTextureAllocated(GLESTexture const& texture);
      // static void OnTextureFreed(GLESTexture const& texture);
      // static void OnBufferAllocated(BufferHandleCR buffer);
      // static void OnBufferFreed(BufferHandleCR buffer);
  //=======================================================================================
  // Target.h
  //=======================================================================================
  export class ShaderLight {
    a: Target;
    b: Vector3d;
  }
  export class RenderScope {
    a: GLES.Target;
  }
  export class Target extends Render.Target {
    a: System;
    b: TileSizeAdjuster;
    c: ColorDef;
    d: Hilite.Settings; // was HiliteSettings;
    e: GLESClips;
    f: Matrix4; // was DMatrix4d
    g: Transform;
    h: RenderCommands;
    l: SceneCompositor;
    m: Point3d;
    n: BranchStack;
    o: Frustum;
    q: GLESBatch;
    r: BeTimePoint;
    s: FeatureOverrides;
    t: FeatureSymbologyOverrides;
    u: OvrGraphicParams;
    v: Id64Set; // Was DgnElementIdSet
    w: PickTable;
    x: FrustumUniforms;
    y: IModelConnection; // was DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    z: BranchState;
    aa: WorldDecorations;
    ab: EdgeOverrides;
    ac: Vector3d;
    ad: ShaderLight;
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
    ap: Vector2d;
    aq: SceneLights; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ar: Render.Device; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
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
    bf: Decorations;
    bg: DecorationList;
    bh: FeatureSymbologyOverrides;
    bi: IModelConnection; // was DgnDb; // DgnPlatform/PublicAPI/DgnPlatform/DgnPlatform.h
    bj: RenderState;
    bk: Render.Target; // DgnPlatform/PublicAPI/DgnPlatform/Render.h

  }
  export class OnScreenTarget extends Target {
    a: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    b: FrameBuffer;
    c: Render.Device; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    d: Render.Target; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    e: System;
    f: DisplaySurface; // ./EGLDisplayContext.h
  }
  export class OffScreenTarget extends Target {
    a: FrameBuffer;
    b: BSIRect; // Geomlibs/PublicAPI/Geom/IntegerTypes/BSIRect.h
    c: System;
    d: Render.Device; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    e: Render.Target; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
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
    aa: ShaderProgram;
    ab: TechniqueFlags;
    ac: ShaderPrograms;
  }
  export class VariedTechnique extends Technique {
    aa: ShaderProgram;
    ab: TechniqueFlags;
    ac: ProgramBuilder;
    ad: FeatureDimensions;
    ae: WithClipVolume;
    af: ShaderSource.FeatureSymbologyOptions; // was FSOptions;
    ag: FragmentShaderComponent;
    ah: VertexShaderComponent;
    ak: ShaderSource.Fragment;
    al: ShaderSource.FeatureSymbology;
    am: ShaderSource.FeatureSymbologyUniform;
    an: VariableType;
    ao: ShaderSource.Vertex;
    ap: ShaderSource.Translucency;
    aq: ShaderPrograms;
  }
  export const enum SurfaceTechniqueShaderIndex {
    kOpaque = 0,
    kTranslucent = 2,
    kOverrides = 4,
    kMonochrome = 8,
    kFeature = 16,
    kHilite = NumFeatureVariants(kFeature),
    kClip = kHilite + NumHiliteVariants()
  }
  export class SurfaceTechnique extends VariedTechnique {
    ba: SurfaceTechniqueShaderIndex;
    bb: TechniqueFlags;
    bc: WithClipVolume;
    bd: LUTDimension;
    be: ShaderSource.Surface;
    bf: FeatureDimensions;
    bg: ShaderSource.FeatureSymbologyOptions; // was FSOptions;
    bh: ShaderSource.Material;
    bi: Technique;
  }
  export const enum PolylineTechniqueShaderIndex {
    kOpaque = 0,
    kTranslucent = 2,
    kOverrides = 4,
    kMonochrome = 8,
    kFeature = 16,
    kHilite = NumFeatureVariants(kFeature),
    kClip = kHilite + NumHiliteVariants()
  }
  export class PolylineTechnique extends VariedTechnique {
    ba: PolylineTechniqueShaderIndex;
    bb: TechniqueFlags;
    bc: ShaderSource.Polyline;
    bd: FeatureDimensions;
    be: LUTDimension;
    bf: ShaderSource.FeatureSymbologyOptions; // was FSOptions;
    bg: WithClipVolume;
    bh: ShaderSource.FeatureSymbology;
    bi: Technique;
  }
  export const enum EdgeTechniqueShaderIndex {
    kOpaque = 0,
    kTranslucent = 2,
    kOverrides = 4,
    kMonochrome = 8,
    kFeature = 16,
    kClip = kHilite + NumHiliteVariants()
  }
 export class EdgeTechnique extends VariedTechnique {
    ba: EdgeTechniqueShaderIndex;
    bb: TechniqueFlags;
    bc: FeatureDimensions;
    bd: ShaderSource.Edge;
    be: ShaderSource.FeatureSymbologyOptions; // was FSOptions;
    bf: LUTDimension;
    bg: WithClipVolume;
    bh: Technique;
    bi: ShaderSource.FeatureSymbology;
  }
  export class SilhouetteEdgeTechnique extends EdgeTechnique {}
  export const enum PointStringTechniqueShaderIndex {
    kOpaque = 0,
    kTranslucent = 2,
    kOverrides = 4,
    kMonochrome = 8,
    kFeature = 16,
    kHilite = NumFeatureVariants(kFeature),
    kClip = kHilite + NumHiliteVariants()
  }
  export class PointStringTechnique extends VariedTechnique {
    ba: PointStringTechniqueShaderIndex;
    bb: TechniqueFlags;
    bc: WithClipVolume;
    bd: LUTDimension;
    be: ShaderSource.PointString;
    bf: ShaderSource.FeatureSymbologyOptions; // was FSPOptions;
    bg: FeatureDimensions;
    bh: Technique;
    bi: ShaderSource.FeatureSymbology;
    bj:
  }
  export class PointCloudTechnique extends VariedTechnique {
    ba: TechniqueFlags;
    bb: WithClipVolume;
    bc: FragmentShaderComponent;
    bd: ShaderSource.PointCloud;
    be: ShaderSource.Fragment;
    bf: Technique;
  }
  export class Techniques {
    b: Technique;
    c: TechniqueId;
    d: Target;
    e: RenderPass;
    f: DrawParams;
  }
  // Texture
  export class GLESTextureCreateParams {
    a: GL.TextureFormat;
    b: GL.TextureDataType;
    c: ByteStream; // ?
    d: Point2d;
    e: GL.TextureInternalFormat;
    f: GL.WrapMode; // was WrapMode;
    g: TextureFlags;
    h: Render.Image; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    i: IsTranslucent;
    j: GLESTexture;
    k: UniformHandle; // ./Handle.ts
    l: TextureUnit;
  }
  export class GLESTextureUpdater {
    a: ByteStream; // ?
    b: OvrFlags;
  }
  export class GLESTexture {
    a: GLESTextureCreateParams;
    c: TextureUnit;
    d: UniformHandle; // ./Handle.ts
    f: GL.TextureFormat; // was GLESTextureFormat;
    g: GL.TextureDataType; // was GLESTextureDataType;
    h: GLESTextureUpdater;
  }
  export class ImageTexture extends GLESTexture {
    aa: Render.Image; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ab: Render.Texture; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    ac: IsTranslucent;
  }
  export class ColorTexture extends GLESTexture {
    ab: GL.InternalTextureFormat; // was GLESTextureInternalFormat;
    ac: GL.TextureDataType; // GLESTextureDataType;
    ad: IsTranslucent;
  }
  export class Texture extends Render.Texture {
    a: ImageTexture;
    b: Render.ImageSource; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    c: IsTranslucent;
    d: Render.Texture.CreateParams; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
    e: UnformHandle; // ./Handle.ts
    f: TextureUnit;
    g: assert; // was BeAssert;
    h: Render.Image; // DgnPlatform/PublicAPI/DgnPlatform/Render.h
  }
}